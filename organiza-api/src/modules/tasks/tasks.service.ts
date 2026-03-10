import { prisma } from "../../lib/prisma";
import { Task } from "../../types/task.type";
import { AppError } from "../../utils/app.error";
import { TaskCreateSchema } from "./tasks.schema";
import { Priority, Status } from "@prisma/client";

class TaskService {
  static async createNewTask(data: TaskCreateSchema): Promise<Task> {
    const createdTask = await prisma.task.create({ data: data });

    return createdTask;
  }

  static async getTasksByListId(id: string): Promise<Task[]> {
    const listId = id;

    const selectedTasks = await prisma.task.findMany({
      where: { listId },
      orderBy: { createdAt: "desc" },
    });

    return selectedTasks;
  }

  static async updateTask(
    id: string,
    title: string,
    description: string,
    priority: Priority,
    status: Status,
    dueDate: string,
  ): Promise<Task> {
    const selectedTask = await prisma.task.findUnique({ where: { id } });

    if (!selectedTask) {
      throw new AppError("Tarefa não encontrada", 404);
    }

    const dataToUpdate = {
      ...(title && { title }),
      ...(description && { description }),
      ...(priority && { priority }),
      ...(status && { status }),
      ...(dueDate && { dueDate }),
    };
    const updatedTask = await prisma.task.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedTask;
  }

  static async deleteTask(id: string): Promise<Task> {
    const selectedTask = await prisma.task.findUnique({ where: { id } });

    if (!selectedTask) {
      throw new AppError("Tarefa não encontrada", 404);
    }

    const deletedTask = await prisma.task.delete({ where: { id } });

    return deletedTask;
  }
}

export { TaskService };
