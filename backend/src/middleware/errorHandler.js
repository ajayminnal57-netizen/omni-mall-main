import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export const notFound = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  let status = error.statusCode ?? 500;
  let message = error.message ?? "Internal server error.";
  let details = error.details;

  if (error instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Database validation failed.";
    details = Object.values(error.errors).map(({ path, message: issue }) => ({ path, message: issue }));
  } else if (error instanceof mongoose.Error.CastError) {
    status = 400;
    message = "Invalid resource identifier.";
  } else if (error.code === 11000) {
    status = 409;
    message = "A record with that value already exists.";
    details = error.keyValue;
  }

  if (status >= 500) console.error(error);
  res.status(status).json({
    success: false,
    error: { message: status >= 500 ? "Internal server error." : message, ...(details ? { details } : {}) },
  });
};