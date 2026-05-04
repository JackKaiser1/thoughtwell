import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { type PagesToNotebooksRecord, type PageRecord } from "../db/schema.js";
import { getPageChildren } from "../db/queries/pages-to-notebooks.js";
import { getPage } from "../db/queries/pages.js";

export async function handlerGetPagesOfNotebook(req: Request, res: Response) {
    const unverifiedNotebookId = req.params.notebookId;
    const notebookId = verifyUUID(unverifiedNotebookId);

    const childParentRecords: PagesToNotebooksRecord[] = await getPageChildren(db, notebookId); 
    if (childParentRecords.length < 0) {
        throw new Error("Could not fetch pagesToNotebooks records");
    }
    
    const queryPromises: Promise<PageRecord>[] = [];
    for (const record of childParentRecords) {
        const pageId = record.childPageId;
        queryPromises.push(getPage(db, pageId));
    }

    const pageRecords: PageRecord[] = await Promise.all(queryPromises);
    if (childParentRecords.length < 0) {
        throw new Error("Could not fetch page records");
    }

    console.log("---");
    for (const page of pageRecords) {
        console.log(page.pageContent);
    }
    console.log("---");

    res.status(200).json(pageRecords);
}