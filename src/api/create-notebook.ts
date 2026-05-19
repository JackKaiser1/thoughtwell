import { Request, Response } from "express";
import { NotebookRecord } from "../db/schema.js";
import { getUser, getUserFromUsername } from "../db/queries/users.js";
import { createNotebook } from "../db/queries/notebooks.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { NotebookNameCharLimit } from "./api-constants.js";

export type NotebookRequest = {
    notebookName: string;  
}

export async function handlerCreateNotebook(req: Request, res: Response) {
    const notebookRequest = verifyNotebook(req.body);
    const userId = verifyUUID(res.locals.userId);

    const notebookQuery: NotebookRecord = {
        userId: userId,
        notebookName: notebookRequest.notebookName,
    }

    const notebookRecord = await createNotebook(db, notebookQuery);
    if (!notebookRecord) {
        throw new Error("failed to create notebook");
    }

    res.status(201).json(notebookRecord);
}

export function verifyNotebook(notebookRequest: unknown) {
    if (!isNotebook(notebookRequest)) {
        throw new BadRequestError("Payload is invalid type");
    }

    if (notebookRequest.notebookName.length > NotebookNameCharLimit) {
        throw new BadRequestError(`Notebook name exceeds character limit of ${NotebookNameCharLimit}`);
    }

    return notebookRequest;
}

export function isNotebook(obj: unknown): obj is NotebookRequest {
    if (!(obj as NotebookRequest).notebookName || typeof (obj as NotebookRequest).notebookName !== "string") {
        return false
    }

    return true;
}