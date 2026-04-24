import { expect, test, describe, it } from "vitest"
import { validatePageData } from "../../api/pages.js";
import { BadRequestError } from "../../api/errors.js";


describe("validatePageData", () => {
    it("should return abc", () => {
        expect(validatePageData({ note: "abc" }, 140)).toBe("abc");
    });

    it("should throw error due to malformed data", () => {
        // @ts-ignore  -- Simulate malformed user data from request 
        expect(() => validatePageData({ noe: "123" }, 140)).toThrow();
    });

    it("should throw error due to character limit", () => {
        expect(() => validatePageData({ note: "hello world"}, 5)).toThrow();
    });
});



