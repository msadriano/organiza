import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AppError } from "../../utils/app.error";

class AuthController {
  static async checkEmailExists(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email é obrigatório", 400);
    }

    const emailExists = await AuthService.checkEmailExists(email);

    return res.status(200).json({ exists: emailExists });
  }
}

export { AuthController };
