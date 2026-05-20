import express from 'express';
import { protect } from '../middleware/auth.js';
import { getTasks } from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);
router.get('/', getTasks);

export default router;
