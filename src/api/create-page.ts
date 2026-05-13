import { Request, Response } from "express";
import { type PageQuery, createPage } from "../db/queries/pages.js";
import { getUser, getUserFromUsername } from "../db/queries/users.js";
import { verifyPageData } from "../lib/verify-page.js";
import { CharacterLimit } from "./api-constants.js";
import { db } from "../db/index.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { type PageRecord } from "../db/schema.js";
import { verifyUUID } from "../lib/verify-uuid.js";

export async function handlerCreatePage(req: Request, res: Response) {
    const pageObj = verifyPageData(req.body, CharacterLimit);

    const userId = verifyUUID(res.locals.userId);
    const userRecord = await getUser(db, userId);
    if (!userRecord) {
        throw new NotFoundError("User not found");
    }

    const pageQuery: PageQuery = {
        pageContent: pageObj.pageContent,
        userId: userRecord.id,
    }

    const pageRecord = await createPage(db, pageQuery);
    if (!pageRecord) {
        throw new Error("Failed to add page to db");
    }

    res.status(201).json(pageRecord);
}