import { Request, Response } from "express";
import { getUsers, getUser } from "../db/queries/users.js";
import { UserRecord } from "../db/schema.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";

export async function handlerGetUsers(req: Request, res: Response): Promise<void> {
    const users: UserRecord[] = await getUsers<dbClient>(db);
    if (!users) {
        throw new NotFoundError("Users not found");
    }

    if (!users.length) {
        console.log("Users table is empty");
        res.status(200).send("OK");
        return;
    }

    console.log("-- Users:");
    for (const user of users) {
        console.log(`${user.userName}`);
    }
    console.log("--");

    res.status(200).send({ users: users});
}

export async function handlerGetUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    if (!userId) {
        throw new BadRequestError("must provide user id as path parameter");
    } else if (typeof userId !== "string") {
        throw new BadRequestError("user id must be string");
    }

    verifyUUID(userId);

    const user: UserRecord = await getUser<typeof db>(db, userId);
    if (!user) {
        throw new NotFoundError("user not found");
    }

    res.status(200).json(user);
}