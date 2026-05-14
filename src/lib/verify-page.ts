import { BadRequestError } from "../api/errors.js";

export type PageObj = {
    pageContent: string;
}

export function verifyPageData(page: unknown, limit: number) {
    if (!isPageData(page)) {
        throw new BadRequestError("payload shape is invalid");
    }

    const charCount = page.pageContent.split("").length;
    if (charCount > limit) {
        throw new BadRequestError("note exceeds character limit");
    }

    return page;
}

export function isPageData(obj: unknown): obj is PageObj {
    if (!(obj as PageObj).pageContent || typeof (obj as PageObj).pageContent !== "string" ) {
        return false
    } 

    return true;
} 