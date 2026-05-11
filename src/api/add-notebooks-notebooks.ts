import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { addChildrenToNotebook } from "../lib/add-children.js";
import { createNotebooksToNotebooks, deleteNotebooksToNotebooks } from "../db/queries/notebooks-to-notebooks.js";
import { makeChildNotebook } from "../db/queries/notebooks.js";
import { NotebooksToNotebooksRecord } from "../db/schema.js";

export async function handlerAddNotebooksToNotebook(req: Request, res: Response) {
    const childParentRecords: NotebooksToNotebooksRecord[] = await addChildrenToNotebook(db, 
                                                                                        req.body, 
                                                                                        deleteNotebooksToNotebooks,
                                                                                        createNotebooksToNotebooks, 
                                                                                        makeChildNotebook);
    if (childParentRecords.length < 1) {
        throw new Error("Failed add notebook to notebook");
    }

    res.status(201).json(childParentRecords);
}