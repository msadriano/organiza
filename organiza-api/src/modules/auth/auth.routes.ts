import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateBody } from "../../middlewares/validate";
import { checkEmailSchema } from "./auth.schema";

const authRoutes = Router();

authRoutes.post(
  "/check-email",
  validateBody(checkEmailSchema),
  AuthController.checkEmailExists,
);

export { authRoutes };
