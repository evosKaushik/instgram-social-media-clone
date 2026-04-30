import multer from "multer";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // ✅ Handle Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: err.message, // e.g. "File too large"
    });
  }

  // ✅ Handle custom file type error
  if (err.message === "Only images allowed") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
