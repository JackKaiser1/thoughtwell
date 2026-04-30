import { expect, test, describe, it } from "vitest"
import { verifyPageData } from "../../lib/verify-page.js";
import { BadRequestError } from "../../api/errors.js";


describe("validatePageData", () => {
    it("should return abc", () => {
        expect(verifyPageData({ userName: "User", pageContent: "abc" }, 140)).toEqual({ userName: "User", pageContent: "abc" });
    });

    it("should throw error due to malformed data", () => {
        // @ts-ignore  -- Simulate malformed user data from request 
        expect(() => verifyPageData({ userName: "User", pageCtent: "123" }, 140)).toThrow();
    });

    it("should throw error due to character limit", () => {
        expect(() => verifyPageData({ userName: "User", pageContent: "hello world"}, 5)).toThrow();
    });
});



