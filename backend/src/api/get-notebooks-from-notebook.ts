import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { getChildren } from "../db/queries/notebooks-to-notebooks.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { printProperties } from "../lib/print-properties.js";
import { getPage } from "../db/queries/pages.js";
import { getNotebook } from "../db/queries/notebooks.js";
import { NotebookRecord, PageRecord, SketchMetadataRecord } from "../db/schema.js";
import { getSketch } from "../db/queries/sketches.js";
import { appendPresignedURL } from "../lib/append-presigned-url.js";

export async function handlerGetChildren(req: Request, res: Response) {
    const notebookId = verifyUUID(req.params.notebookId);
    const userId = verifyUUID(res.locals.userId);

    const notebookRecord = await getNotebook(db, notebookId);
    if (userId !== notebookRecord.userId) {
        throw new UnauthorizedError("User is not authorized to this notebook");
    }


    const children = await getChildren(db, notebookId);
    if (children.pageChildren.length < 1 &&
        children.notebookChildren.length < 1 &&
        children.sketchChildren.length < 1) {
        
        const fetchedChildren = {
            pages: [],
            notebooks: [],
            sketches: []
        }

        res.status(200).json(fetchedChildren);
        return;
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
                throw new ForbiddenError("User is not authorized to the requested pages");
            }
        }

    } 
    
    const sketchQueryPromises: Promise<SketchMetadataRecord>[] = [];
    for ( const sketchChild of children.sketchChildren) {
        const sketchId = sketchChild.childSketchId;

        sketchQueryPromises.push(getSketch(db, sketchId));
    }

    const sketchMetadataRecords = await Promise.all(sketchQueryPromises);
    if (sketchMetadataRecords.length >= 1) {

        for (const sketch of sketchMetadataRecords) {
            if (userId !== sketch.userId) {
                throw new ForbiddenError("User is not authorized to the requested sketches");
            }
        }
    }

    const presignedSketchRecords = await appendPresignedURL(sketchMetadataRecords);

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
                throw new ForbiddenError("User is not authorized to the requested notebooks");
            }
        }

    }

    printProperties(notebookRecords, "notebookName");


    const fetchedChildren = {
        pages: pageRecords,
        notebooks: notebookRecords,
        sketches: presignedSketchRecords
    }

    res.status(200).json(fetchedChildren);
}