import express, { Request, Response, NextFunction } from "express";
import AppError from "./utils/AppError";
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";
import globalErrorHandler from "./controllers/errorController";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("json spaces", 2);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

export default app;
