import { Request, Response } from "express";
import { AppError } from "../../utils/app.error";
import { UserService } from "./users.service";

class UserController {

    static async getMe(req: Request, res: Response){
        const userId = req.userId

        if(!userId) {
            throw new AppError("Mão autorizado", 401)
        }
        
        const selectedUser = await UserService.getInfoMe(userId)

        return res.status(200).json(selectedUser)
    }

    static async updateMe(req: Request, res: Response){
        const userId = req.userId
        const {name, email, avatar_url} = req.body

        if(!userId) {
            throw new AppError("Não autorizado", 401)
        }

        const updatedUser = await UserService.updateInfoMe(userId, {name, email, avatar_url})

        return res.status(200).json(updatedUser)
    }

}

export {UserController}