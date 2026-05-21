export default {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meetflow',
  jwtSecret: process.env.JWT_SECRET || 'meetflow-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudApiKey: process.env.CLOUDINARY_API_KEY,
  cloudApiSecret: process.env.CLOUDINARY_API_SECRET,
  resendApiKey: process.env.RESEND_API_KEY,
};
