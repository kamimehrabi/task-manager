import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import AppError from "./AppError";

export const Validate = (
    schema: ObjectSchema,
    property: "body" | "params" | "query" = "body",
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const messages = error.details
                .map((detail) => detail.message)
                .join(", ");
            return next(new AppError(messages, 400));
        }

        next();
    };
};
