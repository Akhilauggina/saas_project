import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    duration: { type: String, default: '—' },
    taskCount: { type: Number, default: 0 },
    status: { type: String, enum: ['processing', 'done'], default: 'done' },
    icon: { type: String, default: '📋' },
    transcript: { type: String, default: '' },
    summary: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
