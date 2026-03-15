import "express-async-errors";
import express from "express";
import cors from "cors";
import { routes } from "./routes/routes";
import { ErrorHandler } from "./middlewares/errorHandler";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  statusCode: 429,
  message: "Limite de requisições atingido, aguarde por 5 minutos",
});

const app = express();

app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  }),
);
app.use(express.json());
app.use(routes);

app.use(ErrorHandler);

export { app };
