import { UserFields } from "../models/userModel";

declare global {
    namespace Express {
        interface Request {
            user?: UserFields;
        }
    }
}

export {};
