import { prisma } from "../../lib/prisma";
import { Task } from "../../types/task.type";
import { AppError } from "../../utils/app.error";
import { TaskCreateManySchema, TaskCreateSchema } from "./tasks.schema";
import { Priority, Status } from "@prisma/client";

class TaskService {
  static async createNewTask(
    userId: string,
    data: TaskCreateSchema,
  ): Promise<Task> {
    const list = await prisma.list.findUnique({ where: { id: data.listId } });

    if (!list) {
      throw new AppError("Lista não encontrada", 404);
    }

    if (userId !== list?.userId) {
      throw new AppError("Não autorizado", 403);
    }

    const createdTask = await prisma.task.create({ data: data });

    return createdTask;
  }

  static async getTasksByListId(userId: string, id: string): Promise<Task[]> {
    const listId = id;

    const selectedTasks = await prisma.task.findMany({
      where: { listId, list: { userId } },
      orderBy: { createdAt: "desc" },
    });

    return selectedTasks;
  }

  static async updateTask(
    userId: string,
    id: string,
    title: string,
    description: string,
    priority: Priority,
    status: Status,
    dueDate: string,
  ): Promise<Task> {
    const selectedTask = await prisma.task.findUnique({
      where: { id, list: { userId } },
    });

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

  static async deleteTask(userId: string, id: string): Promise<Task> {
    const selectedTask = await prisma.task.findUnique({
      where: { id, list: { userId } },
    });

    if (!selectedTask) {
      throw new AppError("Tarefa não encontrada", 404);
    }

    const deletedTask = await prisma.task.delete({ where: { id } });

    return deletedTask;
  }

  static async createManyTasks(data: TaskCreateManySchema[]) {
    const tasksCreated = await prisma.task.createMany({
      data: data,
    });

    return tasksCreated;
  }
}

export { TaskService };
