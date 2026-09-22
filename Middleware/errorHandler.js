const logger = require("../Config/logger");

module.exports = (err, req, res, next) => {
  logger.error({ message: err.message, stack: err.stack, method: req.method, path: req.originalUrl });

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with this value already exists" });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message,
    ...(err.details ? { details: err.details } : {})
  });
};