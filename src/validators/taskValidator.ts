import Joi from "joi";

//-------------------------------------- Create Task Schema Validator

export const createTaskBodySchema = Joi.object({
    title: Joi.string().min(5).max(40).required(),
    description: Joi.string().min(1).required(),
    status: Joi.string().valid("pending", "in-progress", "done").required(),
});

//-------------------------------------- Update Task Schema Validator

export const updateTaskParamSchema = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
        "string.length": "'id' must be a 24-character hex string",
        "string.hex": "'id' must only contain hexadecimal characters",
        "any.required": "'id' parameter is required",
    }),
});

export const updateTaskBodySchema = Joi.object({
    title: Joi.string().min(5).max(40).optional(),
    description: Joi.string().min(1).optional(),
    status: Joi.string().valid("pending", "in-progress", "done").optional(),
});

//-------------------------------------- Get Task Schema Validator

export const getTaskParamSchema = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
        "string.length": "'id' must be a 24-character hex string",
        "string.hex": "'id' must only contain hexadecimal characters",
        "any.required": "'id' parameter is required",
    }),
});

//-------------------------------------- Delete Task Schema Validator

export const deleteTaskParamSchema = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
        "string.length": "'id' must be a 24-character hex string",
        "string.hex": "'id' must only contain hexadecimal characters",
        "any.required": "'id' parameter is required",
    }),
});
