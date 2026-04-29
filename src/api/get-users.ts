import { Request, Response } from "express";
import { getUsers } from "../db/queries/users.js";
import { UserRecord } from "../db/schema.js";
import { NotFoundError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";


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