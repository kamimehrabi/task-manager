import { NextFunction, Request, Response } from "express";
import User, { UserFields } from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import verifyJWT from "../utils/verifyJwt";

export interface AuthenticatedRequest extends Request {
    user?: UserFields;
}

class AuthController {
    private static secret: string = process.env.JWT_SECRET || "default_secret";
    private static expiresIn: string = process.env.JWT_EXPIRES_IN || "1h";

    constructor() {}

    private static signToken(id: string): string {
        return jwt.sign({ id }, this.secret, {
            expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"],
        });
    }

    static signUp = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const createdUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
            });

            const token = this.signToken(createdUser._id);

            res.status(201).json({
                status: "success",
                token: token,
                data: {
                    user: createdUser,
                },
            });
        },
    );

    static login = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new AppError("Please provide email and password", 400);
            }

            const foundUser = await User.findOne({ email }).select("+password");

            if (
                !foundUser ||
                !(await foundUser.correctPassword(password, foundUser.password))
            ) {
                throw new AppError("Incorrect email or password", 401);
            }

            const token = this.signToken(foundUser._id);

            res.status(200).json({
                status: "success",
                token: token,
            });
        },
    );

    static protect = catchAsync(
        async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction,
        ) => {
            let token: string | undefined;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                token = req.headers.authorization?.split(" ")[1];
            }
            if (!token) {
                throw new AppError(
                    "You are not logged in! Please log in to get access.",
                    401,
                );
            }

            const decoded = await verifyJWT(token, this.secret);

            if (typeof decoded === "string") {
                throw new AppError("Invalid token format.", 401);
            }

            const currentUser = await User.findById(
                (decoded as jwt.JwtPayload).id,
            );
            if (!currentUser) {
                throw new AppError(
                    "The user belonging to this token does not exist.",
                    401,
                );
            }

            if (currentUser.changedPasswordAfter(decoded.iat!)) {
                throw new AppError(
                    "User recently changed password! Please log in again.",
                    401,
                );
            }

            // Extend the Request type to include 'user'
            req.user = currentUser;
            next();
        },
    );
}

export default AuthController;
