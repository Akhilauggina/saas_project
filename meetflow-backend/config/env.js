import dotenv from 'dotenv';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meetflow',
  jwtSecret: process.env.JWT_SECRET || 'meetflow-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
