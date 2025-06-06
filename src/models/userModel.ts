import mongoose, { Document, Model, Schema } from "mongoose";
const validator = require("validator");
import { NextFunction } from "express";
import bcrypt from "bcryptjs";

export interface UserFields extends Document {
    _id: string; 
    name: string;
    email: string;
    photo: string;
    password: string;
    passwordConfirm: string | undefined;

    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    changedPasswordAfter(JWTTimeStamp: number): boolean;
}

const UserSchema: Schema<UserFields> = new Schema({
    name: {
        type: String,
        maxlength: [
            50,
            "A task title must have more or equal than 50 characters",
        ],
        minlength: [
            3,
            "A task title must have less or equal than 3 characters",
        ],
        required: [true, "please provide your name"],
    },
    email: {
        type: String,
        required: [true, "please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "please provide a valid email"],
    },
    photo: String,
    password: {
        type: String,
        required: [true, "please provide a password"],
        minlength: [8, "A password must have more or equal than 8 characters"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (this: UserFields, val: string) {
                return val === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
});

UserSchema.pre<UserFields>("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string,
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (
    this: UserFields & { passwordChangedAt?: Date },
    JWTTimeStamp: number
): boolean {
    if (this.passwordChangedAt) {
        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};

const User: Model<UserFields> = mongoose.model<UserFields>("User", UserSchema);

export default User;
