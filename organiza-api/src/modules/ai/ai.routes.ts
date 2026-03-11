import { Router } from "express";
import { authEnsure } from "../../middlewares/authEnsure";
import { validateBody } from "../../middlewares/validate";
import { aiPromptSchema } from "./ai.schema";
import { AiController } from "./ai.controller";

const aiRoutes = Router();

aiRoutes.post(
  "/",
  authEnsure,
  validateBody(aiPromptSchema),
  AiController.aiCreateTasks,
);

export { aiRoutes };
