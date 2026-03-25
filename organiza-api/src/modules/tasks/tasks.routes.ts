import { Router } from "express";
import { authEnsure } from "../../middlewares/authEnsure";
import { validateBody, validateParams } from "../../middlewares/validate";
import {
  taskCreateSchema,
  taskDeleteBodySchema,
  taskUpdateSchema,
  taskUpdateManySchema,
} from "./tasks.schema";
import { TaskController } from "./tasks.controller";
import { idParamsValidateSchema } from "../lists/lists.schema";

const tasksRoutes = Router();

tasksRoutes.post(
  "/",
  authEnsure,
  validateBody(taskCreateSchema),
  TaskController.createTask,
);

tasksRoutes.get("/", authEnsure, TaskController.getTasksByUserId);

tasksRoutes.patch(
  "/",
  authEnsure,
  validateBody(taskUpdateManySchema),
  TaskController.updateManyTasks,
);

tasksRoutes.get(
  "/:id",
  authEnsure,
  validateParams(idParamsValidateSchema),
  TaskController.getTasksByListId,
);

tasksRoutes.put(
  "/:id",
  authEnsure,
  validateParams(idParamsValidateSchema),
  validateBody(taskUpdateSchema),
  TaskController.updateTask,
);

tasksRoutes.delete(
  "/",
  authEnsure,
  validateBody(taskDeleteBodySchema),
  TaskController.deleteTask,
);

export { tasksRoutes };
