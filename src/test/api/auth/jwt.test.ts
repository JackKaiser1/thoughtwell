import { expect, describe, it, vi } from "vitest";
import { createJWT, verifyJWT } from "../../../api/auth/jwt.ts";
import { BadRequestError } from "../../../api/errors.ts";

describe("createJWT / verifyJWT", () => {
    const jwt1 = createJWT("afac2-1541f-241dd", 60, "secret");
 
    it("should successfully validate JWT and return userId", () => {
        const userId = verifyJWT(jwt1, "secret");
        expect(userId).toEqual("afac2-1541f-241dd");
    });

    it("should fail to validate JWT due to expired token", () => {
        vi.useFakeTimers();
        vi.advanceTimersByTime(60_000);
        expect(() => verifyJWT(jwt1, "secret")).toThrow(BadRequestError);
        vi.useRealTimers();
    });

    it("should fail to validate JWT due to incorrect secret", () => {
        expect(() => verifyJWT(jwt1, "secre t")).toThrow();
    });
});

