import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

process.on("uncaughtException", (err: Error) => {
    console.log(err.name, err.message);
    console.log("uncaught exception! shutting down...");
    process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

if (!DB) {
    console.error("Database connection string is missing or invalid");
    process.exit(1);
}

mongoose
    .connect(DB)
    .then(() => {
        console.log("database is connected");
    })
    .catch((err: Error) => {
        console.error("Database connection error:", err);
    });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`listening to port ${port}...`);
});

process.on("unhandledRejection", (err: any) => {
    console.log(err.name, err.message);
    console.log("unhandled rejection! shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
