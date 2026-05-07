import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { getChildren } from "../db/queries/notebooks-to-notebooks.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { printProperties } from "../lib/print-properties.js";
import { getPage } from "../db/queries/pages.js";
import { getNotebook } from "../db/queries/notebooks.js";
import { NotebookRecord, PageRecord } from "../db/schema.js";

export async function handlerGetChildren(req: Request, res: Response) {
    const notebookId = verifyUUID(req.params.notebookId);

    const children = await getChildren(db, notebookId);
    if (!children) {
        throw new BadRequestError("children not found for given notebook");
    }

    const pageQueryPromises: Promise<PageRecord>[] = [];
    for (const pageChild of children.pageChildren) {
        pageQueryPromises.push(getPage(db, pageChild.childPageId));
    }
    const pageRecords = await Promise.all(pageQueryPromises);
    if (!pageRecords) {
        throw new NotFoundError("could not get page children");
    }

    printProperties(pageRecords, "pageContent");

    const notebookQueryPromises: Promise<NotebookRecord>[] = [];
    for (const notebookChild of children.notebookChildren) {
        notebookQueryPromises.push(getNotebook(db, notebookChild.childNotebookId));
    }
    const notebookRecords = await Promise.all(notebookQueryPromises);
    if (!notebookRecords) {
        throw new NotFoundError("could not get notebook children");
    }

    printProperties(notebookRecords, "notebookName");

    res.status(200).json(children);
}