import { Request, Response } from "express";
import { NotebookRecord } from "../db/schema.js";
import { BadRequestError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { getNotebooks } from "../db/queries/notebooks.js";

export async function handlerGetNotebooks(req: Request, res: Response) {
    const unverifiedUserId = req.query.userId;
    const userId = verifyUUID(unverifiedUserId);

    const notebookRecords = await getNotebooks(db, userId);
    if (!notebookRecords.length) {
        throw new BadRequestError("no notebooks found for user");
    }

    printNotebooks(notebookRecords);

    res.status(200).json(notebookRecords);
}

function printNotebooks(notebooks: NotebookRecord[]) {
    console.log("---");
    for (const notebook of notebooks) {
        console.log(notebook.notebookName);
    }
    console.log("---");
}