export default function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value provided' });
  }

  res.status(err.status || 500).json({ message: err.message || 'Server error' });
}
