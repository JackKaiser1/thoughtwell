import { createUser } from "../db/queries/users.js";
import { processPassword } from "./auth/password.js";
import { Request, Response } from "express";
import { verifyUserData } from "../lib/verify-user.js";
import { UserRecord } from "../db/schema.js";
import { type dbClient, db } from "../db/index.js";

export async function handlerCreateUser(req: Request, res: Response) {
    const user = verifyUserData(req.body);
    const hashedPassword = await processPassword(user.password);

    const newUser: UserRecord = {
        userName: user.userName,
        hashedPassword: hashedPassword,
    }

    const userRecord = await createUser<dbClient>(db, newUser);
    if (!userRecord) {
        throw new Error("Query failed");
    }

    // Remove hashedPassword from response later
    res.status(201).json({ 
        id: userRecord.id,
        userName: userRecord.userName,
        hashedPassword: userRecord.hashedPassword,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
    });
}
