import ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';

export async function extractAudioFromBuffer(buffer, outputFormat = 'wav') {
  return new Promise((resolve, reject) => {
    const inputStream = Readable.from(buffer);
    const passthrough = new PassThrough();
    const chunks = [];

    passthrough.on('data', (chunk) => chunks.push(chunk));
    passthrough.on('end', () => resolve(Buffer.concat(chunks)));
    passthrough.on('error', (err) => reject(err));

    try {
      ffmpeg(inputStream)
        .format(outputFormat)
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .on('error', (err) => reject(err))
        .pipe(passthrough, { end: true });
    } catch (err) {
      reject(err);
    }
  });
}

export default { extractAudioFromBuffer };
