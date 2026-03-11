import { Request, Response } from "express";
import { AiService } from "./ai.service";
import { AppError } from "../../utils/app.error";

class AiController {
  static async aiCreateTasks(req: Request, res: Response) {
    const userId = req.userId;
    const prompt = req.body;

    if (!userId) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const tasksCreated = await AiService.createTasks(userId, prompt);

    return res.status(200).json(tasksCreated);
  }
}

export { AiController };
