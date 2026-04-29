import e from "express";
import { BadRequestError } from "../api/errors.js";

export function verifyUUID(uuid: string): void {
    const hexChars = "0123456789abcdef";

    const splitUUID = uuid.split("-");
    if (splitUUID.length !== 5) {
        throw new BadRequestError("invalid uuid: must have 5 sections delimited by '-'");
    }

    let partNum = 1;
    let errCode = 0;
    for (const part of splitUUID) {
        const partLength = part.length;

        //    Ensure uuid matches 8-4-4-4-12 pattern
        switch (partNum) {
            case 1:
                if (partLength === 8) break;
                else { errCode = 1; break; };
            case 2:
            case 3:
            case 4:
                if (partLength === 4) break;
                else { errCode = 1; break; };
            case 5: 
                if (partLength === 12) break;
                else { errCode = 1; break; };
        }

        if (errCode === 1) {
            throw new BadRequestError("invalid uuid: must follow 8-4-4-4-12 pattern");
        }

        for (const char of part) {
            if (!hexChars.includes(char)) {
                throw new BadRequestError("invalid uuid: each section of uuid must only include hexadecimal values");
            }
        }

        partNum++;
    }
}