import { Request, Response } from "express";
import { NotebookRecord } from "../db/schema.js";
import { getUser, getUserFromUsername } from "../db/queries/users.js";
import { createNotebook } from "../db/queries/notebooks.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";

type NotebookRequest = {
    notebookName: string;  
}

export async function handlerCreateNotebook(req: Request, res: Response) {
    const notebookReq = req.body;
    if (!notebookReq.notebookName) {
        throw new BadRequestError("Notebook must have a name");
    }

    const userId = verifyUUID(res.locals.userId);

    const notebookQuery: NotebookRecord = {
        userId: userId,
        notebookName: notebookReq.notebookName,
    }

    const notebookRecord = await createNotebook(db, notebookQuery);
    if (!notebookRecord) {
        throw new Error("failed to create notebook");
    }

    res.status(201).json(notebookRecord);
}