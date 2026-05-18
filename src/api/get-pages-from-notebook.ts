import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { type PagesToNotebooksRecord, type PageRecord } from "../db/schema.js";
import { getPageChildren } from "../db/queries/pages-to-notebooks.js";
import { getPage } from "../db/queries/pages.js";
import { getNotebook } from "../db/queries/notebooks.js";
import { printProperties } from "../lib/print-properties.js";

export async function handlerGetPagesOfNotebook(req: Request, res: Response) {
    const notebookId = verifyUUID(req.params.notebookId);
    const userId = verifyUUID(res.locals.userId);

    const notebookRecord = await getNotebook(db, notebookId);
    if (userId !== notebookRecord.userId) {
        throw new UnauthorizedError("User is not authorized to this notebook");
    }

    const childParentRecords: PagesToNotebooksRecord[] = await getPageChildren(db, notebookId); 
    if (childParentRecords.length < 1) {
        throw new NotFoundError("Pages not found");
    }
    
    const queryPromises: Promise<PageRecord>[] = [];
    for (const record of childParentRecords) {
        const pageId = record.childPageId;
        queryPromises.push(getPage(db, pageId));
    }

    const pageRecords: PageRecord[] = await Promise.all(queryPromises);
    if (pageRecords.length < 1) {
        throw new NotFoundError("Pages not found");
    }

    for (const page of pageRecords) {
        if (userId !== page.userId) {
            throw new UnauthorizedError("User is not authorized to the requested pages");
        }
    }

    printProperties(pageRecords, "pageContent");

    res.status(200).json(pageRecords);
}