import AppError from "../utils/AppError.js";

export const notFound = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  let status = error.statusCode ?? 500;
  let message = error.message ?? "Internal server error.";
  let details = error.details;

  if (status >= 500) console.error(error);
  res.status(status).json({
    success: false,
    error: { message: status >= 500 ? "Internal server error." : message, ...(details ? { details } : {}) },
  });
};