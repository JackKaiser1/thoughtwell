import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { createPagesToNotebooks } from "../db/queries/pages-to-notebooks.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { type PageRecord, type PagesToNotebooksRecord, pages } from "../db/schema.js";
import { makeChildPage } from "../db/queries/pages.js";
import { addChildrenToNotebook } from "../lib/add-children.js";

export type PagesToAdd = {
    pageIds: string[];
    userId: string;
    notebookId: string;
}

export async function handlerAddPagesToNotebook(req: Request, res: Response) {
    const childParentRecords = await addChildrenToNotebook(db, req.body, createPagesToNotebooks, makeChildPage);

    for (const element of childParentRecords) {
        if (!element) {
            throw new BadRequestError("attempted to create duplicate records");
        }
    }

    res.status(201).json(childParentRecords);
}


