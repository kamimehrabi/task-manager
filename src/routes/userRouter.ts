import express from "express";
import AuthController from "../controllers/authController";
import { loginBodySchema, signupBodySchema } from "../validators/authValidator";
import { Validate } from "../utils/validate";

const router = express.Router();

router.post(
    "/signup",
    Validate(signupBodySchema, "body"),
    AuthController.signUp,
);
router.post("/login", Validate(loginBodySchema, "body"), AuthController.login);

export default router;
