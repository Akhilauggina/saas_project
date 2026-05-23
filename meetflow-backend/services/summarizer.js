import OpenAI from 'openai';
import env from '../config/env.js';

const client = new OpenAI({ apiKey: env.openaiApiKey });

const DEFAULT_MODEL = 'gpt-4o-mini';

export async function summarizeTranscript(transcript, options = {}) {
  if (!transcript || !transcript.trim()) {
    return {
      summary: '',
      actionItems: [],
      keyDecisions: [],
      followUps: [],
    };
  }

  const systemPrompt = `You are an assistant that extracts concise meeting summaries.
Return only valid JSON with the following keys: summary (one short paragraph), actionItems (array of short action item strings), keyDecisions (array of short decision strings), followUps (array of short follow-up tasks). Be concise and factual.`;

  const userPrompt = `Transcript:\n"""\n${transcript}\n"""\n\nOutput the JSON structure exactly.`;

  try {
    const resp = await client.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 700,
    });

    const content = resp?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from summarization API');

    // Try to find JSON in content and parse it
    const jsonStart = content.indexOf('{');
    const jsonText = jsonStart === -1 ? content : content.slice(jsonStart);
    const parsed = JSON.parse(jsonText);

    // Normalize fields
    return {
      summary: parsed.summary || '' ,
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : parsed.action_items || [],
      keyDecisions: Array.isArray(parsed.keyDecisions) ? parsed.keyDecisions : parsed.key_decisions || [],
      followUps: Array.isArray(parsed.followUps) ? parsed.followUps : parsed.follow_ups || [],
    };
  } catch (err) {
    console.error('Summarization error:', err);
    return {
      summary: '',
      actionItems: [],
      keyDecisions: [],
      followUps: [],
    };
  }
}

export default { summarizeTranscript };
