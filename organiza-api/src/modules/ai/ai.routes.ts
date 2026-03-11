import { Router } from "express";
import { authEnsure } from "../../middlewares/authEnsure";
import { validateBody } from "../../middlewares/validate";
import { aiPromptSchema } from "./ai.schema";
import { AiController } from "./ai.controller";
import { rateLimit } from "express-rate-limit";

const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 15,
  statusCode: 429,
  message: "Limite de requisições para IA atingido, aguarde por 5 minutos",
});

const aiRoutes = Router();

aiRoutes.post(
  "/",
  aiLimiter,
  authEnsure,
  validateBody(aiPromptSchema),
  AiController.aiCreateTasks,
);

export { aiRoutes };
