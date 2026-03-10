import { Request, Response } from "express";
import { TaskService } from "./tasks.service";
import { AppError } from "../../utils/app.error";

class TaskController {
  static async createTask(req: Request, res: Response) {
    const data = req.body;

    const createdTask = await TaskService.createNewTask(data);

    return res.status(201).json(createdTask);
  }

  static async getTasksByListId(req: Request, res: Response) {
    const { id } = req.params;

    const selectedTasks = await TaskService.getTasksByListId(id);

    return res.status(200).json(selectedTasks);
  }

  static async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    const updatedTask = await TaskService.updateTask(
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
    const { id } = req.params;

    const deletedTask = await TaskService.deleteTask(id);

    return res.status(200).json(deletedTask);
  }
}

export { TaskController };
