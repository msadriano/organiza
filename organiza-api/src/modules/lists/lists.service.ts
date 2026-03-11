import { AppError } from "../../utils/app.error";
import { prisma } from "../../lib/prisma";
import type { List } from "../../types/lists.type";

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
    userId: string,
    id: string,
    title: string,
    color: string,
  ): Promise<List> {
    const selectedList = await prisma.list.findUnique({
      where: { id, userId },
    });

    if (!selectedList) {
      throw new AppError(
        "A lista selecionada não existe no banco de dados",
        404,
      );
    }

    const updatedList = await prisma.list.update({
      where: { id, userId },
      data: { ...(title && { title }), ...(color && { color }) },
    });

    return updatedList;
  }

  static async deleteList(userId: string, id: string): Promise<List> {
    const selectList = await prisma.list.findUnique({ where: { id, userId } });

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
