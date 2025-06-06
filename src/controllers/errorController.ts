import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const handleJWTError = () =>
  new AppError('invalid token! please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token is expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, res: Response): void => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: AppError, res: Response): void => {
    // Operational error, trusted: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming or other unknown error, don't leak error details
    } else {
        // Log error
        console.log("error", err);
        // Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
};

const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }

    if (process.env.NODE_ENV === "production") {
        let error: AppError = {
            ...err,
            message: err.message,
            name: err.name,
            path: (err as any).path,
            value: (err as any).value,
        };

        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};

export default errorHandler;
