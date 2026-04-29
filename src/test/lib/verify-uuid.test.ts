import { describe, it, expect } from "vitest";
import { verifyUUID } from "../../lib/verify-uuid";
import { BadRequestError } from "../../api/errors";

describe("verifyUUID", () => {
    it("should successfully verify UUID and not throw error", () => {
        const uuid = "a3bc1423-a3b1-5441-1fab-3ad2a514abc9";

        verifyUUID(uuid); 
    });

    it("should throw error due to non hex value", () => {
        const uuid = "x3bc1423-a3b1-5441-1fab-3ad2a514abc9";

        expect(() => verifyUUID(uuid)).toThrow(BadRequestError);
    });

    it("should throw error due to malformed uuid structure", () => {
        const uuid = "a3bc1423-3ad2a514abc9"; 

        expect(() => verifyUUID(uuid)).toThrow(BadRequestError);
    });

    it("should throw error due to parts of uuid being wrong length", () => {
        const uuid = "a-a3b1-5-1fab-3ad2";

        expect(() => verifyUUID(uuid)).toThrow(BadRequestError);
    });
});