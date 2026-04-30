import { BadRequestError } from "../api/errors.js";

export type PageObj = {
    userName: string;
    pageContent: string;
}

export function verifyPageData(pageObj: PageObj, limit: number) {
    const content = pageObj.pageContent;
    if (!content) {
        throw new BadRequestError("page must have content");
    }

    const userName = pageObj.userName;
    if (!userName) {
        throw new BadRequestError("request must contain username");
    }

    const charCount = content.split("").length;
    if (charCount > limit) {
        throw new BadRequestError("note exceeds character limit");
    }

    return pageObj;
}