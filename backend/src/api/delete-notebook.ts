import { Request, Response } from "express";
import { verifyUUID } from "../lib/verify-uuid.js";
import { deleteNotebook, getNotebook } from "../db/queries/notebooks.js";
import { db } from "../db/index.js";
import { ForbiddenError, NotFoundError } from "./errors.js";

export async function handlerDeleteNotebook(req: Request, res: Response) {
    const notebookId = verifyUUID(req.params.notebookId);
    const userId = verifyUUID(res.locals.userId);

    const notebookRecord = await getNotebook(db, notebookId);
    if (!notebookRecord) {
        throw new NotFoundError("Notebook not found");
    }

    if (userId !== notebookRecord.userId) {
        throw new ForbiddenError("User not authorized to delete this notebook");
    }

    await deleteNotebook(db, notebookId);
    res.status(204).send();
}