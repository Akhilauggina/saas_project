import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    assignee: { type: String, default: 'Unassigned', trim: true },
    deadline: { type: String, default: 'No deadline' },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    done: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
