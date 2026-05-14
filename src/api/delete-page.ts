import { Request, Response } from "express";
import { deletePage, getPage } from "../db/queries/pages.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { db } from "../db/index.js";

export async function handlerDeletePage(req: Request, res: Response) {
    const pageId = req.params.pageId;
    if (!pageId) {
        throw new BadRequestError("Must provide page Id as path parameter");
    } else if (typeof pageId !== "string") {
        throw new BadRequestError("Page Id must be a string");
    }

    verifyUUID(pageId);

    const pageRecord = await getPage(db, pageId);

    const pageUserId = pageRecord.userId;
    const userId = verifyUUID(res.locals.userId);
    if (userId !== pageUserId) {
        throw new UnauthorizedError("Not authorized to delete page");
    }

    await deletePage(db, pageId);

    res.status(204).send();
}