import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { createMeeting, getMeetings, getMeetingById } from '../controllers/meetingController.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('audio'), createMeeting);
router.get('/', getMeetings);
router.get('/:id', getMeetingById);

export default router;
