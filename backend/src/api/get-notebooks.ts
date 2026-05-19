import { Request, Response } from "express";
import { NotebookRecord } from "../db/schema.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { getNotebooks, getTopLevelNotebooks } from "../db/queries/notebooks.js";
import { printProperties } from "../lib/print-properties.js";

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

export async function handlerGetTopLevelNotebooks(req: Request, res: Response) {
    const userId = verifyUUID(res.locals.userId);

    const topLevelNotebooks = await getTopLevelNotebooks(db, userId);
    if (topLevelNotebooks.length < 1) {
        throw new NotFoundError("Notebooks not found");
    }

    printProperties(topLevelNotebooks, "notebookName");

    res.status(200).json(topLevelNotebooks);
}