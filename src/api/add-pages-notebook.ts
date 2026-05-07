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
    // const unverifiedPagesToAdd: PagesToAdd = req.body;
    // const pagesToAdd = verifyPagesToAdd(unverifiedPagesToAdd);

    // const childParentRecords = await pageToNotebookQuery(db, pagesToAdd);
    // await makePageChildren(db, pagesToAdd.pageIds);

    const childParentRecords = await addChildrenToNotebook(db, req.body, createPagesToNotebooks, makeChildPage);

    for (const element of childParentRecords) {
        if (!element) {
            throw new BadRequestError("attempted to create duplicate records");
        }
    }

    res.status(201).json(childParentRecords);
}










// Function must be used after UUID verification
export async function pageToNotebookQuery(client: dbClient, pagesToAdd: PagesToAdd): Promise<PagesToNotebooksRecord[]> {
    const queryPromises: Promise<PagesToNotebooksRecord>[] = [];

    for (const pageId of pagesToAdd.pageIds) {
        
        const childParentQuery: PagesToNotebooksRecord = {
            userId: pagesToAdd.userId,
            parentNotebookId: pagesToAdd.notebookId,
            childPageId: pageId,
        }
        queryPromises.push(createPagesToNotebooks(client, childParentQuery));
    }

    const pagesToNoteBooksRecords = await Promise.all(queryPromises);
    return pagesToNoteBooksRecords;
}


// Function must be used after UUID verification
export async function makePageChildren(client: dbClient, pageIds: string[]): Promise<PageRecord[]> {
    const queryPromises: Promise<PageRecord>[] = [];

    for (const pageid of pageIds) {
        queryPromises.push(makeChildPage(client, pageid));
    }

    return await Promise.all(queryPromises);
}


export function verifyPagesToAdd(unverifiedPagesToAdd: PagesToAdd): PagesToAdd {
    if (!unverifiedPagesToAdd) {
        throw new BadRequestError("invalid request");
    } else if (unverifiedPagesToAdd.pageIds.length < 1) {
        throw new BadRequestError("pageIds array must contain at least one page id");
    } else if (!unverifiedPagesToAdd.userId) {
        throw new BadRequestError("payload must contain userId property");
    } else if (!unverifiedPagesToAdd.notebookId) {
        throw new BadRequestError("payload must contain notebookId property");
    }

    const userId = verifyUUID(unverifiedPagesToAdd.userId);
    const notebookId = verifyUUID(unverifiedPagesToAdd.notebookId);
    
    const pageIds: string[] = [];
    for (const pageId of unverifiedPagesToAdd.pageIds) {
        pageIds.push(verifyUUID(pageId));
    }

    return {
        userId: userId,
        notebookId: notebookId,
        pageIds: pageIds,
    }
}