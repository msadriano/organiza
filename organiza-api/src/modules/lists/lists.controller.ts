import { Request, Response } from "express";
import { ListsService } from "./lists.service";
import { AppError } from "../../utils/app.error";

class ListsController {
  static async create(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) throw new AppError("Não autorizado", 401);

    const { title, color } = req.body;

    const createdList = await ListsService.createList(userId, title, color);

    return res.status(201).json(createdList);
  }

  static async getLists(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const lists = await ListsService.getAllLists(userId);

    return res.status(200).json(lists);
  }

  static async updateList(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { title, color } = req.body;

    if (!title && !color) {
      throw new AppError(
        "Não existe nenhuma informação para ser atualizada",
        200,
      );
    }

    await ListsService.updateList(id, title, color);

    return res.status(204).send();
  }

  static async deleteList(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    const deletedList = await ListsService.deleteList(id);

    return res.status(200).json(deletedList);
  }
}

export { ListsController };
