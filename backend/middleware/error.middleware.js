const errorHandler = (err, req, res, next) => {
  console.error(`${req.method} ${req.originalUrl}`, err);

  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal server error";

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;

    const fields = Object.keys(err.keyPattern || {});

    message = `${fields.join(", ")} already exists`;
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;

    const errors = Object.values(err.errors).map((error) => error.message);

    message = errors.join(", ");
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
