import { Request, Response } from "express";
import { Router } from "express";
import { authEnsure } from "../middlewares/authEnsure";
import { tasksRoutes } from "../modules/tasks/tasks.routes";
import { listsRoutes } from "../modules/lists/lists.routes";
import { aiRoutes } from "../modules/ai/ai.routes";

const routes = Router();

routes.get("/api/health", (req: Request, res: Response) => {
  res.json({ ok: true });
});

routes.use("/api/tasks", tasksRoutes);
routes.use("/api/lists", listsRoutes);
routes.use("/api/ai", aiRoutes);

export { routes };
