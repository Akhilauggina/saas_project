import Task from '../models/Task.js';

function serializeTask(task) {
  const result = task.toObject({ getters: true });
  result.id = String(result._id);
  result.meetingId = String(result.meeting || result.meetingId || '');
  return result;
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ tasks: tasks.map(serializeTask) });
  } catch (error) {
    next(error);
  }
}
