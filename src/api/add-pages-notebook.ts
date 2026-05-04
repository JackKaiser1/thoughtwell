import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { db } from "../db/index.js";
import { createPagesToNotebooks } from "../db/queries/pages-to-notebooks.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { type PagesToNotebooksRecord, pages } from "../db/schema.js";

export type PagesToAdd = {
    pageIds: string[];
    userId: string;
    notebookId: string;
}

export async function handlerAddPagesToNotebook(req: Request, res: Response) {
    const pagesToAdd: PagesToAdd = req.body;
    if (!pagesToAdd) {
        throw new BadRequestError("invalid request");
    } else if (pagesToAdd.pageIds.length < 1) {
        throw new BadRequestError("pageIds array must contain at least one page id");
    } else if (!pagesToAdd.userId) {
        throw new BadRequestError("payload must contain userId property");
    } else if (!pagesToAdd.notebookId) {
        throw new BadRequestError("payload must contain notebookId property");
    }

    verifyUUID(pagesToAdd.userId);
    verifyUUID(pagesToAdd.notebookId);
    for (const pageId of pagesToAdd.pageIds) {
        verifyUUID(pageId);
    }


    const queryPromises: Promise<PagesToNotebooksRecord>[] = [];
    for (const pageId of pagesToAdd.pageIds) {
        const childParentQuery: PagesToNotebooksRecord = {
            userId: pagesToAdd.userId,
            parentNotebookId: pagesToAdd.notebookId,
            childPageId: pageId,
        }
        queryPromises.push(createPagesToNotebooks(db, childParentQuery));
    }

    const pagesToNoteBooksRecords = await Promise.all(queryPromises);
    if (!pagesToNoteBooksRecords) {
        throw new Error("failed to add records to db");
    }

    res.status(201).json(pagesToNoteBooksRecords);
}