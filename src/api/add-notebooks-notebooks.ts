import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { addChildrenToNotebook } from "../lib/add-children.js";
import { createNotebooksToNotebooks, deleteNotebooksToNotebooks } from "../db/queries/notebooks-to-notebooks.js";
import { makeChildNotebook } from "../db/queries/notebooks.js";
import { NotebooksToNotebooksRecord } from "../db/schema.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { verifyChildrenToAdd } from "../lib/verify-childrenToAdd.js";

export async function handlerAddNotebooksToNotebook(req: Request, res: Response) {
    const authenticatedUserId = verifyUUID(res.locals.userId);
    const authorizedPayload = await verifyChildrenToAdd(db, req.body, authenticatedUserId);

    const childParentRecords: NotebooksToNotebooksRecord[] = await addChildrenToNotebook(db, 
                                                                                        authorizedPayload, 
                                                                                        deleteNotebooksToNotebooks,
                                                                                        createNotebooksToNotebooks, 
                                                                                        makeChildNotebook);
    if (childParentRecords.length < 1) {
        throw new Error("Failed to add notebook to notebook");
    }

    res.status(201).json(childParentRecords);
}