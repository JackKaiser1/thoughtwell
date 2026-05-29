import { Request, Response } from "express";
import { getPages, getPage, getLoosePages } from "../db/queries/pages.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { printProperties } from "../lib/print-properties.js";

export async function handlerGetPages(req: Request, res: Response) {
    const userId = verifyUUID(res.locals.userId);

    const pageRecords = await getPages(db, userId);
    if (pageRecords.length < 1) {
        throw new NotFoundError("Pages not found");
    }

    printProperties(pageRecords, "pageContent");

    res.status(200).json(pageRecords);
}

export async function handlerGetPage(req: Request, res: Response) {
    const pageId = req.params.pageId;
    if (!pageId) {
        throw new BadRequestError("Must provide page Id as path parameter");
    } else if (typeof pageId !== "string") {
        throw new BadRequestError("Page Id must be a string");
    }

    verifyUUID(pageId);

    const pageRecord = await getPage(db, pageId);
    if (!pageRecord) {
        throw new NotFoundError("Page not found");
    } 
    
    const userId = verifyUUID(res.locals.userId);
    const pageUserId = pageRecord.userId;
    if (userId !== pageUserId) {
        throw new UnauthorizedError("User is not authorized to this resource");
    }

    res.status(200).json(pageRecord);
}

export async function handlerGetLoosePages(req: Request, res: Response) {
    const userId = verifyUUID(res.locals.userId);

    const loosePageRecords = await getLoosePages(db, userId);

    printProperties(loosePageRecords, "pageContent");

    res.status(200).json(loosePageRecords);
}