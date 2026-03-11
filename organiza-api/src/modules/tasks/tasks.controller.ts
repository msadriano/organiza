import { Request, Response } from "express";
import { TaskService } from "./tasks.service";
import { AppError } from "../../utils/app.error";

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

  static async getTasksByListId(req: Request, res: Response) {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const selectedTasks = await TaskService.getTasksByListId(userId, id);

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

  static async deleteTask(req: Request, res: Response) {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Não autorizado", 401);
    }

    const deletedTask = await TaskService.deleteTask(userId, id);

    return res.status(200).json(deletedTask);
  }
}

export { TaskController };
