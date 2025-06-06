import { required } from "joi";
import mongoose, { Document, Model, Schema } from "mongoose";

export type TaskStatuses = "pending" | "in-progress" | "done";

export interface TaskFields extends Document {
    title: string;
    description: string;
    status: TaskStatuses;
    user: mongoose.Types.ObjectId;
}

const TaskSchema: Schema<TaskFields> = new Schema(
    {
        title: {
            type: String,
            required: [true, "A task must have a title"],
            trim: true,
            maxlength: [
                40,
                "A task title must have more or equal than 40 characters",
            ],
            minlength: [
                5,
                "A task title must have less or equal than 10 characters",
            ],
        },
        description: {
            type: String,
            trim: true,
            required: [true, "A task must have a description"],
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "in-progress", "done"],
                message: "Status must be either: pending, in-progress, or done",
            },
            default: "pending",
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Task must belong to a user"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

const Task: Model<TaskFields> = mongoose.model<TaskFields>("Task", TaskSchema);

export default Task;
