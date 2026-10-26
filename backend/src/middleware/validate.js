import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return next(new AppError(400, "Request validation failed.", result.error.issues));
  }

  req.validated = result.data;
  return next();
};