import { Request, Response } from "express";
import { deletePage, getPage } from "../db/queries/pages.js";
import { BadRequestError } from "./errors.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { db } from "../db/index.js";

export async function handlerDeletePage(req: Request, res: Response) {
    const pageId = req.params.pageId;
    if (!pageId) {
        throw new BadRequestError("must provide page id as path parameter");
    } else if (typeof pageId !== "string") {
        throw new BadRequestError("pageId parameter must be string");
    }

    verifyUUID(pageId);

    await deletePage(db, pageId);
    const deletedPage = await getPage(db, pageId);
    if (deletedPage !== undefined) {
        throw new Error("page failed to delete");
    }

    res.status(204).send();
}