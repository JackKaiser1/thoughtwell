import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { getChildren } from "../db/queries/notebooks-to-notebooks.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { printProperties } from "../lib/print-properties.js";
import { getPage } from "../db/queries/pages.js";
import { getNotebook } from "../db/queries/notebooks.js";
import { NotebookRecord, PageRecord } from "../db/schema.js";

export async function handlerGetChildren(req: Request, res: Response) {
    const notebookId = verifyUUID(req.params.notebookId);
    const userId = verifyUUID(res.locals.userId);

    const notebookRecord = await getNotebook(db, notebookId);
    if (userId !== notebookRecord.userId) {
        throw new UnauthorizedError("User is not authorized to this notebook");
    }


    const children = await getChildren(db, notebookId);
    if (children.pageChildren.length < 1 &&
        children.notebookChildren.length < 1) {
        throw new NotFoundError("Children not found for given notebook");
    }


    const pageQueryPromises: Promise<PageRecord>[] = [];
    for (const pageChild of children.pageChildren) {
        const pageId = pageChild.childPageId;

        pageQueryPromises.push(getPage(db, pageId));
    }

    const pageRecords = await Promise.all(pageQueryPromises);
    if (pageRecords.length >= 1) {

        for (const page of pageRecords) {
            if (userId !== page.userId) {
                throw new UnauthorizedError("User is not authorized to the requested pages");
            }
        }

    } 
    
    printProperties(pageRecords, "pageContent");
    

    const notebookQueryPromises: Promise<NotebookRecord>[] = [];
    for (const notebookChild of children.notebookChildren) {
        const notebookId = notebookChild.childNotebookId;

        notebookQueryPromises.push(getNotebook(db, notebookId));
    }

    const notebookRecords = await Promise.all(notebookQueryPromises);
    if (notebookRecords.length >= 1) {

        for (const notebook of notebookRecords) {
            if (userId !== notebook.userId) {
                throw new UnauthorizedError("User is not authorized to the requested notebooks");
            }
        }

    }

    printProperties(notebookRecords, "notebookName");


    const fetchedChildren = {
        pages: pageRecords,
        notebooks: notebookRecords,
    }

    res.status(200).json(fetchedChildren);
}