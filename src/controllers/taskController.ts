import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Task from "../models/taskModel";
import AppError from "../utils/AppError";
import APIFeatures from "../utils/apiFeatures";
import { AuthenticatedRequest } from "./authController";

class TaskController {
    constructor() {}

    static createTask = catchAsync(
        async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction,
        ) => {
            const user = req.user;

            if (!req.user) {
                return next(new AppError("User not authenticated", 401));
            }
            const taskData = {
                ...req.body,
                user: user?._id,
            };

            const createdTask = await Task.create(taskData);

            res.status(201).json({
                data: createdTask,
                status: "success",
                message: "Task created successfully",
            });
        },
    );

    static getAllTasks = catchAsync(
        async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction,
        ) => {
            const filter = { user: req.user?._id };
            const features = new APIFeatures(Task.find(filter), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();

            const tasks = await features.query;

            res.status(200).json({
                data: tasks,
                status: "success",
                message: "Tasks retrieved successfully",
            });
        },
    );

    static updateTask = catchAsync(
        async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction,
        ) => {
            const { id } = req.params;
            const userId = req.user?._id;

            const foundTask = await Task.findOneAndUpdate(
                { _id: id, user: userId },
                req.body,
                {
                    new: true,
                    runValidators: true,
                },
            );

            if (!foundTask) throw new AppError("Task not found", 404);

            res.status(200).json({
                data: foundTask,
                status: "success",
                message: "Task updated successfully",
            });
        },
    );

    static deleteTask = catchAsync(
        async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction,
        ) => {
            const { id } = req.params;
            const userId = req.user?._id;

            const foundTask = await Task.findByIdAndDelete({
                _id: id,
                user: userId,
            });

            if (!foundTask) throw new AppError("Task not found", 404);

            res.status(204).json({
                data: null,
                status: "success",
            });
        },
    );

    static getTask = catchAsync(
        async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction,
        ) => {
            const { id } = req.params;
            const userId = req.user?._id;

            const foundTask = await Task.findOne({ _id: id, user: userId });

            if (!foundTask) throw new AppError("Task not found", 404);

            res.status(200).json({
                data: foundTask,
                status: "success",
                message: "Task retrieved successfully",
            });
        },
    );
}

export default TaskController;
