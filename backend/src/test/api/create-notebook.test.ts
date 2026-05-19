import { expect, describe, it, expectTypeOf } from "vitest";
import { type NotebookRequest, verifyNotebook, isNotebook } from "../../api/create-notebook";
import { BadRequestError } from "../../api/errors";
import { NotebookNameCharLimit } from "../../api/api-constants";

describe("verifyNotebook", () => {
    it("should verify notebook", () => {
        const notebookRequest = { notebookName: "New notebook" };
        expect(verifyNotebook(notebookRequest)).toEqual({ notebookName: "New notebook" });
    });

    it("should throw error due to improper shape", () => {
        const notebookRequest = { Name: "New notebook" };
        expect(() => verifyNotebook(notebookRequest)).toThrow(new BadRequestError("Payload is invalid type"));
    });

    it("should throw error due to exceeded charater limit", () => {
        const notebookRequest = { notebookName: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam molestie tincidunt tortor, eu elementum metus interdum nec. Duis pulvinar justo ex, et efficitur metus maximus sit amet. Donec non porttitor odio. Mauris a libero turpis. Praesent eu est ipsum. Aliquam nec eleifend dolor, in blandit purus. Ut tincidunt est elit, sed consectetur purus sodales sit amet. Sed accumsan orci in." };
        expect(() => verifyNotebook(notebookRequest)).toThrow(new BadRequestError(`Notebook name exceeds character limit of ${NotebookNameCharLimit}`));
    });
});