import { expect, test, describe, it } from "vitest"
import { verifyPageData, isPageData } from "../../lib/verify-page.js";
import { BadRequestError } from "../../api/errors.js";


describe("verifyPageData / isPageData", () => {
    const page = {}

    it("should return abc", () => {
        expect(verifyPageData({ pageContent: "abc" }, 140)).toEqual({ pageContent: "abc" });
    });

    it("should throw error due to malformed data", () => {
        // @ts-ignore  -- Simulate malformed user data from request 
        expect(() => verifyPageData({ pageCtent: "123" }, 140)).toThrow();
    });

    it("should throw error due to character limit", () => {
        expect(() => verifyPageData({ pageContent: "hello world"}, 5)).toThrow();
    });
});

describe("isPageData", () => {
    it("should return true for proper type", () => {
        const page = { pageContent: "new note" };
        const isPage = isPageData(page);
        expect(isPage).toEqual(true);
    });

    it("should return false for improper type", () => {
        const badPage = { pagentent: "new note" };
        const isPage = isPageData(badPage);
        expect(isPage).toEqual(false);
    });
});



