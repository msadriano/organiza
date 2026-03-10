import "express-async-errors";
import express from "express";
import { routes } from "./routes/routes";
import { ErrorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(routes);

app.use(ErrorHandler);

export { app };
