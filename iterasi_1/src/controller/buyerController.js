// Helper untuk response uniform
const ok = (res, message, data = null, status = 200) =>
  res.status(status).json({ success: true, message, data });

const fail = (res, message, status = 400, data = null) =>
  res.status(status).json({ success: false, message, data });
