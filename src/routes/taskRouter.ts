import express from "express";

import TaskController from "../controllers/taskController";
import { Validate } from "../utils/validate";
import {
    createTaskBodySchema,
    getTaskParamSchema,
    updateTaskBodySchema,
    updateTaskParamSchema,
} from "../validators/taskValidator";
import AuthController from "../controllers/authController";

const router = express.Router();

router.get("/", AuthController.protect, TaskController.getAllTasks);

router.post(
    "/",
    AuthController.protect,
    Validate(createTaskBodySchema, "body"),
    TaskController.createTask,
);
router.get(
    "/:id",
    AuthController.protect,
    Validate(getTaskParamSchema, "params"),
    TaskController.getTask,
);

router.put(
    "/:id",
    AuthController.protect,
    Validate(updateTaskBodySchema, "body"),
    Validate(updateTaskParamSchema, "params"),
    TaskController.updateTask,
);

router.delete("/:id", AuthController.protect, TaskController.deleteTask);

export default router;
