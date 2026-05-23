import { Readable } from 'stream';
import Meeting from '../models/Meeting.js';
import Task from '../models/Task.js';
import cloudinary from '../config/cloudinary.js';
import { extractAudioFromBuffer } from '../services/ffmpeg.js';
import { transcribeAudioBuffer } from '../services/whisper.js';
import { summarizeTranscript } from '../services/summarizer.js';

const DEFAULT_TASKS = [
  { title: 'Review meeting notes', assignee: 'You', deadline: 'Today', priority: 'high' },
  { title: 'Assign follow-up tasks', assignee: 'Team', deadline: 'Tomorrow', priority: 'medium' },
  { title: 'Share recap with stakeholders', assignee: 'You', deadline: 'End of day', priority: 'high' },
];

function serializeMeeting(meeting) {
  const result = meeting.toObject({ getters: true });
  result.id = String(result._id);
  return result;
}

function serializeTask(task) {
  const result = task.toObject({ getters: true });
  result.id = String(result._id);
  result.meetingId = String(result.meeting || result.meetingId || '');
  return result;
}

function buildExtractedTasks(meetingId, userId, title) {
  return DEFAULT_TASKS.map((task, index) => ({
    meeting: meetingId,
    user: userId,
    title: `${task.title} — ${title}`,
    assignee: task.assignee,
    deadline: task.deadline,
    priority: task.priority,
    done: index === 2,
  }));
}

export async function createMeeting(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'An audio file is required.' });
    }

    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'A meeting title is required.' });
    }

    // Prepare audio buffer for transcription: if a video was uploaded, extract audio.
    let transcriptText = `Uploaded file ${req.file.originalname}.`;
    let transcriptionError = null;
    try {
      let audioBufferToTranscribe = req.file.buffer;
      const mime = req.file.mimetype || '';
      if (mime.startsWith('video/')) {
        console.log(`Extracting audio from video file: ${req.file.originalname}`);
        audioBufferToTranscribe = await extractAudioFromBuffer(req.file.buffer, 'wav');
      }

      // Send audio to Whisper (OpenAI) and get transcript
      console.log(`Transcribing audio (${(audioBufferToTranscribe.length / 1024 / 1024).toFixed(2)} MB)…`);
      const text = await transcribeAudioBuffer(audioBufferToTranscribe);
      if (text && text.trim()) {
        transcriptText = text.trim();
        console.log(`Transcription successful: ${transcriptText.length} characters`);
      }

      // Summarize transcript with GPT service
      try {
        console.log('Generating meeting summary…');
        const ai = await summarizeTranscript(transcriptText);
        // Attach structured ai summary into request for saving later
        req.aiSummary = ai;
        console.log(`Summary generated: ${ai.actionItems?.length || 0} action items, ${ai.keyDecisions?.length || 0} decisions`);
      } catch (sErr) {
        console.error('Summary generation error:', sErr.message);
        transcriptionError = `Summary error: ${sErr.message}`;
      }
    } catch (transErr) {
      // don't fail the whole request if transcription fails; log and continue
      console.error('Transcription error:', transErr.message);
      transcriptionError = transErr.message;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'meetflow-audio',
        public_id: `meeting_${Date.now()}`,
      },
      async (error, result) => {
        if (error) {
          return next(error);
        }

        try {
          const ai = req.aiSummary || {};
          const hasAi = !!(ai && (ai.summary || (ai.actionItems && ai.actionItems.length) || (ai.keyDecisions && ai.keyDecisions.length) || (ai.followUps && ai.followUps.length)));
          const meeting = await Meeting.create({
            title: title.trim(),
            user: req.user.id,
            date: new Date(),
            duration: result.duration ? `${Math.round(result.duration)} sec` : '—',
            taskCount: 0,
            status: hasAi ? 'done' : 'processing',
            icon: '🆕',
            transcript: transcriptText,
            summary: ai.summary || `A new meeting recording was stored in Cloudinary and AI-generated tasks were extracted from the audio.`,
            actionItems: ai.actionItems || [],
            keyDecisions: ai.keyDecisions || [],
            followUps: ai.followUps || [],
            aiSummary: ai,
            audioUrl: result.secure_url,
          });

          const tasks = await Task.insertMany(buildExtractedTasks(meeting._id, req.user.id, title.trim()));
          meeting.taskCount = tasks.length;
          await meeting.save();

          res.status(201).json({
            meeting: serializeMeeting(meeting),
            tasks: tasks.map(serializeTask),
          });
        } catch (saveError) {
          next(saveError);
        }
      },
    );

    Readable.from(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    next(error);
  }
}

export async function getMeetings(req, res, next) {
  try {
    const meetings = await Meeting.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ meetings: meetings.map(serializeMeeting) });
  } catch (error) {
    next(error);
  }
}

export async function getMeetingById(req, res, next) {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user.id });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const tasks = await Task.find({ meeting: meeting._id }).sort({ createdAt: -1 });
    res.json({ meeting: serializeMeeting(meeting), tasks: tasks.map(serializeTask) });
  } catch (error) {
    next(error);
  }
}
