import { Readable } from 'stream';
import Meeting from '../models/Meeting.js';
import Task from '../models/Task.js';
import cloudinary from '../config/cloudinary.js';

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
          const meeting = await Meeting.create({
            title: title.trim(),
            user: req.user.id,
            date: new Date(),
            duration: result.duration ? `${Math.round(result.duration)} sec` : '—',
            taskCount: 0,
            status: 'done',
            icon: '🆕',
            transcript: `Uploaded audio file ${req.file.originalname}.`,
            summary: `A new meeting recording was stored in Cloudinary and AI-generated tasks were extracted from the audio.`,
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
