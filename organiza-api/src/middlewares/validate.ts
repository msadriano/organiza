import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

async function handleValidation(
  req: Request,
  data: any,
  schema: AnyZodObject,
  res: Response,
  next: NextFunction,
) {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      errors: result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  req.body = { ...req.body, ...result.data };

  next();
}

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await handleValidation(req, req.body, schema, res, next);
  };
}

export function validateParams(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await handleValidation(req, req.params, schema, res, next);
  };
}

export function validateQuery(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await handleValidation(req, req.query, schema, res, next);
  };
}
