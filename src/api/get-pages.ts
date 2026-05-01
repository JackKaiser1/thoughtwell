import { Request, Response } from "express";
import { getPages, getPage } from "../db/queries/pages.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";

export async function handlerGetPages(req: Request, res: Response) {
    const userId = req.query.userId;
    if (!userId) {
        throw new BadRequestError("must provide user id as query parameter");
    } else if (typeof userId !== "string") {
        throw new BadRequestError("userId query parameter must be string");
    }

    verifyUUID(userId);

    const pageRecords = await getPages(db, userId);
    if (!pageRecords.length) {
        throw new NotFoundError("failed to fetch pages");
    }

    res.status(200).json(pageRecords);
}

export async function handlerGetPage(req: Request, res: Response) {
    const pageId = req.params.pageId;
    if (!pageId) {
        throw new BadRequestError("must provide page id as path parameter");
    } else if (typeof pageId !== "string") {
        throw new BadRequestError("pageId parameter must be string");
    }

    verifyUUID(pageId);

    const pageRecord = await getPage(db, pageId);
    if (!pageRecord) {
        throw new NotFoundError("page not found");
    }

    res.status(200).json(pageRecord);
}