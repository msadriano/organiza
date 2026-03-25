import { Router } from "express";
import { UserController } from "./users.controller";
import { authEnsure } from "../../middlewares/authEnsure";
import { validateBody } from "../../middlewares/validate";
import { userUpdateSchema } from "./users.schema";

const usersRoutes = Router();

usersRoutes.get("/me", authEnsure, UserController.getMe);
usersRoutes.patch(
  "/",
  authEnsure,
  validateBody(userUpdateSchema),
  UserController.updateMe,
);

export { usersRoutes };
