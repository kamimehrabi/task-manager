import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import AppError from "./AppError";

export const Validate = (
    schema: ObjectSchema,
    property: "body" | "params" | "query" = "body",
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(`Validating ${property}:`, req[property]); // Debug log
        const { error } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            console.log('Validation error:', error.details); // Debug log
            const messages = error.details
                .map((detail) => detail.message)
                .join(", ");
            return next(new AppError(messages, 400));
        }

        console.log('Validation passed'); // Debug log
        next();
    };
};
