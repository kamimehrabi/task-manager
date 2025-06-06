import Joi from "joi";

//-------------------------------------- Signup Schema Validator
export const signupBodySchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name cannot exceed 50 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address!!!!",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
    }),
    passwordConfirm: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Password confirmation is required",
        }),
});

//-------------------------------------- Login Schema Validator
export const loginBodySchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});
