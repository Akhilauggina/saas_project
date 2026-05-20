import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';

const missingVars = [];
if (!env.cloudName) missingVars.push('CLOUDINARY_CLOUD_NAME');
if (!env.cloudApiKey) missingVars.push('CLOUDINARY_API_KEY');
if (!env.cloudApiSecret) missingVars.push('CLOUDINARY_API_SECRET');

if (missingVars.length > 0) {
  throw new Error(
    `Cloudinary credentials missing: ${missingVars.join(', ')}. ` +
      'Please add them to meetflow-backend/.env and restart the server.',
  );
}

cloudinary.config({
  cloud_name: env.cloudName,
  api_key: env.cloudApiKey,
  api_secret: env.cloudApiSecret,
});

export default cloudinary;
