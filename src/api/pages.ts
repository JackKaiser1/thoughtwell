import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { CharacterLimit } from "./api-constants.js";

type PageObj = {
    note: string;
}

export async function handlerAddPage(req: Request, res: Response) {
    const note = validatePageData(req.body, CharacterLimit);

    res.status(200).json({ note: note });
}

export function validatePageData(data: PageObj, limit: number) {
    const note = data.note;
    if (!note) {
        throw new BadRequestError("invalid json - page must have note");
    }

    const charCount = note.split("").length;
    if (charCount > limit) {
        throw new BadRequestError("note exceeds character limit");
    }

    return note;
}