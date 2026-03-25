import { Request, Response } from "express";
import { TaskService } from "./tasks.service";
import { AppError } from "../../utils/app.error";
import {
  taskDeleteBodySchema,
  taskQueryParams,
  taskUpdateManySchema,
} from "./tasks.schema";

class TaskController {
  static async createTask(req: Request, res: Response) {
    const userId = req.userId;
    const data = req.body;

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const createdTask = await TaskService.createNewTask(userId, data);

    return res.status(201).json(createdTask);
  }

  static async getTasksByUserId(req: Request, res: Response) {
    const userId = req.userId;
    const queryParams = taskQueryParams.parse(req.query);

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const selectedTasks = await TaskService.getTasksByUserId(
      userId,
      queryParams,
    );

    return res.status(200).json(selectedTasks);
  }

  static async getTasksByListId(req: Request, res: Response) {
    const userId = req.userId;
    const { id } = req.params;
    const queryParams = taskQueryParams.parse(req.query);

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const selectedTasks = await TaskService.getTasksByListId(
      userId,
      id,
      queryParams,
    );

    return res.status(200).json(selectedTasks);
  }

  static async updateTask(req: Request, res: Response) {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const updatedTask = await TaskService.updateTask(
      userId,
      id,
      title,
      description,
      priority,
      status,
      dueDate,
    );

    return res.status(200).json(updatedTask);
  }

  static async updateManyTasks(req: Request, res: Response) {
    const userId = req.userId;
    const { ids, priority, status, dueDate } = req.body;

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const result = await TaskService.updateManyTasks(userId, ids, {
      priority,
      status,
      dueDate,
    });

    return res.status(200).json(result);
  }

  static async deleteTask(req: Request, res: Response) {
    const userId = req.userId;
    const taskIds = taskDeleteBodySchema.parse(req.body);

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const deletedTask = await TaskService.deleteTasks(userId, taskIds);

    return res.status(200).json(deletedTask);
  }
}

export { TaskController };
