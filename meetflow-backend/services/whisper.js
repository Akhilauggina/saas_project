import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import env from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new OpenAI({ 
  apiKey: env.openaiApiKey,
  timeout: 600000, // 10 minutes for large files
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB safe limit for OpenAI

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff(fn, retries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isConnError = err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT';
      const isServerError = err.status >= 500;
      const shouldRetry = (isConnError || isServerError) && attempt < retries;

      if (!shouldRetry) throw err;

      const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt);
      console.warn(`Transcription attempt ${attempt + 1} failed. Retrying in ${delayMs}ms…`, err.message);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

/**
 * Transcribe audio buffer with retry logic and proper stream handling
 */
export async function transcribeAudioBuffer(buffer, filename = `audio_${Date.now()}.wav`, model = 'whisper-1') {
  if (!buffer || buffer.length === 0) {
    throw new Error('Audio buffer is empty');
  }

  if (buffer.length > CHUNK_SIZE) {
    console.warn(`Audio buffer (${(buffer.length / 1024 / 1024).toFixed(2)} MB) exceeds OpenAI safe size (25 MB). Proceeding with caution.`);
  }

  const tmpDir = path.join(process.cwd(), 'tmp');
  const tmpPath = path.join(tmpDir, filename);

  try {
    // Ensure temp directory exists
    await fs.mkdir(tmpDir, { recursive: true });
    
    // Write buffer to file and verify
    await fs.writeFile(tmpPath, buffer);
    const stats = await fs.stat(tmpPath);
    console.log(`Wrote audio file: ${tmpPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    // Perform transcription with retry logic
    const transcript = await retryWithBackoff(async () => {
      // Use fs.createReadStream with proper error handling
      const audioStream = fsSync.createReadStream(tmpPath);
      
      // Set up stream error handling
      audioStream.on('error', (err) => {
        throw new Error(`Failed to read audio file: ${err.message}`);
      });

      const resp = await client.audio.transcriptions.create(
        {
          file: audioStream,
          model,
          language: 'en',
        },
        { timeout: 600000 }
      );

      if (!resp || typeof resp.text !== 'string') {
        throw new Error('Invalid transcription response: missing text field');
      }

      const text = resp.text.trim();
      if (!text) {
        console.warn('Whisper returned empty transcript');
      }
      return text;
    });

    return transcript;
  } catch (err) {
    // Provide detailed error context
    if (err.code === 'ECONNRESET') {
      throw new Error(`Connection lost during Whisper API call: ${err.message}`);
    }
    if (err.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please retry in a few moments.');
    }
    if (err.status === 401) {
      throw new Error('OpenAI API key is invalid. Check OPENAI_API_KEY environment variable.');
    }
    throw new Error(`Transcription failed: ${err.message}`);
  } finally {
    // Cleanup: remove temp file
    try {
      await fs.unlink(tmpPath);
      console.log(`Cleaned up temp file: ${tmpPath}`);
    } catch (cleanupErr) {
      console.warn(`Failed to clean up temp file ${tmpPath}:`, cleanupErr.message);
    }
  }
}

export default { transcribeAudioBuffer };
