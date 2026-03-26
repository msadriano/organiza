import { prisma } from "../../lib/prisma";
import { Task } from "../../types/task.type";
import { AppError } from "../../utils/app.error";
import {
  TaskCreateManySchema,
  TaskCreateSchema,
  TaskDeleteBodySchema,
  TaskQueryParams,
  TaskUpdateSchema,
} from "./tasks.schema";
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

  static async getTasksByUserId(
    userId: string,
    queryParams: TaskQueryParams,
  ): Promise<Task[]> {
    const selectedTask = await prisma.task.findMany({
      where: {
        list: { userId },
        ...((queryParams.title || queryParams.description) && {
          OR: [
            ...(queryParams.title
              ? [
                  {
                    title: {
                      contains: queryParams.title,
                      mode: "insensitive" as const,
                    },
                  },
                ]
              : []),
            ...(queryParams.description
              ? [
                  {
                    description: {
                      contains: queryParams.description,
                      mode: "insensitive" as const,
                    },
                  },
                ]
              : []),
          ],
        }),
        ...(queryParams.status && { status: queryParams.status as Status }),
        ...(queryParams.priority && {
          priority: queryParams.priority as Priority,
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return selectedTask;
  }

  static async getTasksByListId(
    userId: string,
    id: string,
    queryParams: TaskQueryParams,
  ): Promise<Task[]> {
    const listId = id;

    const selectedTasks = await prisma.task.findMany({
      where: {
        listId,
        list: { userId },
        ...((queryParams.title || queryParams.description) && {
          OR: [
            ...(queryParams.title
              ? [
                  {
                    title: {
                      contains: queryParams.title,
                      mode: "insensitive" as const,
                    },
                  },
                ]
              : []),
            ...(queryParams.description
              ? [
                  {
                    description: {
                      contains: queryParams.description,
                      mode: "insensitive" as const,
                    },
                  },
                ]
              : []),
          ],
        }),
        ...(queryParams.status && { status: queryParams.status as Status }),
        ...(queryParams.priority && {
          priority: queryParams.priority as Priority,
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return selectedTasks;
  }

  static async updateTask(
    userId: string,
    id: string,
    data: TaskUpdateSchema,
  ): Promise<Task> {
    const selectedTask = await prisma.task.findFirst({
      where: { id, list: { userId } },
    });

    if (!selectedTask) {
      throw new AppError("Tarefa não encontrada", 404);
    }

    if (data.listId) {
      const list = await prisma.list.findFirst({
        where: { id: data.listId, userId },
      });

      if (!list) {
        throw new AppError("Lista não encontrada", 404);
      }
    }

    const dataToUpdate = {
      ...(data.listId !== undefined && { listId: data.listId }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
    };

    const updatedTask = await prisma.task.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedTask;
  }

  static async updateManyTasks(
    userId: string,
    ids: string[],
    data: { priority?: Priority; status?: Status; dueDate?: Date },
  ): Promise<{ count: number }> {
    // Validação de ownership
    const ownershipCheck = await prisma.task.findMany({
      where: {
        id: { in: ids },
        list: { userId },
      },
      select: { id: true },
    });

    if (ownershipCheck.length !== ids.length) {
      throw new AppError("Uma ou mais tarefas não pertencem a você", 404);
    }

    // Construir objeto de atualização condicional
    const dataToUpdate = {
      ...(data.priority && { priority: data.priority }),
      ...(data.status && { status: data.status }),
      ...(data.dueDate && { dueDate: data.dueDate }),
    };

    // Atualizar as tarefas
    const result = await prisma.task.updateMany({
      where: {
        id: { in: ids },
      },
      data: dataToUpdate,
    });

    return { count: result.count };
  }

  static async deleteTasks(
    userId: string,
    taskIds: TaskDeleteBodySchema,
  ): Promise<{ count: number }> {
    const deletedTasks = await prisma.task.deleteMany({
      where: {
        id: { in: taskIds.id },
        list: { userId },
      },
    });

    return { count: deletedTasks.count };
  }

  static async createManyTasks(data: TaskCreateManySchema[]) {
    const tasksCreated = await prisma.task.createMany({
      data: data,
    });

    return tasksCreated;
  }
}

export { TaskService };
