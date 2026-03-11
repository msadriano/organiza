import { Router } from "express";
import { ListsController } from "./lists.controller";
import { validateBody, validateParams } from "../../middlewares/validate";
import { authEnsure } from "../../middlewares/authEnsure";
import {
  listBodyUpdateSchema,
  listCreateSchema,
  idParamsValidateSchema,
} from "./lists.schema";

const listsRoutes = Router();

listsRoutes.post(
  "/",
  authEnsure,
  validateBody(listCreateSchema),
  ListsController.create,
);

listsRoutes.get("/", authEnsure, ListsController.getLists);

listsRoutes.put(
  "/:id",
  authEnsure,
  validateParams(idParamsValidateSchema),
  validateBody(listBodyUpdateSchema),
  ListsController.updateList,
);

listsRoutes.delete(
  "/:id",
  authEnsure,
  validateParams(idParamsValidateSchema),
  ListsController.deleteList,
);

export { listsRoutes };
