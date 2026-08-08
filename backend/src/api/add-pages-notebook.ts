import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { createPagesToNotebooks, deletePagesToNotebooks } from "../db/queries/pages-to-notebooks.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { type PageRecord, type PagesToNotebooksRecord, pages } from "../db/schema.js";
import { makeChildPage } from "../db/queries/pages.js";
import { addChildrenToNotebook } from "../lib/add-children.js";
import { verifyChildrenToAdd } from "../lib/verify-childrenToAdd.js";

export async function handlerAddPagesToNotebook(req: Request, res: Response) {
    const authenticatedUserId = verifyUUID(res.locals.userId);
    const authorizedPayload = await verifyChildrenToAdd(db, req.body, authenticatedUserId);

    const childParentRecords = await addChildrenToNotebook(db, authorizedPayload, deletePagesToNotebooks, createPagesToNotebooks, makeChildPage);

    for (const element of childParentRecords) {
        if (!element) {
            throw new BadRequestError("Attempted to create duplicate records");
        }
    }

    res.status(201).json(childParentRecords);
}


