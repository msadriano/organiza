import { AppError } from "../../utils/app.error";
import { prisma } from "../../lib/prisma";
import type { List } from "../../types/lists.type";
import { ListParamsUpdateSchema } from "./lists.schema";

class ListsService {
  static async createList(
    userId: string,
    title: string,
    color?: string,
  ): Promise<List> {
    const createdList = await prisma.list.create({
      data: { userId, title, ...(color && { color }) },
    });

    return createdList;
  }

  static async getAllLists(userId: string): Promise<List[]> {
    const lists = await prisma.list.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return lists;
  }

  static async updateList(
    id: string,
    title: string,
    color: string,
  ): Promise<void> {
    await prisma.list.update({
      where: { id },
      data: { ...(title && { title }), ...(color && { color }) },
    });

    return;
  }

  static async deleteList(id: string): Promise<List> {
    const selectList = await prisma.list.findUnique({ where: { id } });

    if (!selectList) {
      throw new AppError(
        "A lista selecionada não existe no banco de dados",
        404,
      );
    }

    const deletedList = await prisma.list.delete({ where: { id } });

    return deletedList;
  }
}

export { ListsService };
