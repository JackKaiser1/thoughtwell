import { expect, describe, it } from "vitest"
import { verifyUserData, isUserLogin } from "../../lib/verify-user";
import { BadRequestError } from "../../api/errors";

describe("verifyUserData / isUserLogin", () => {
    const userRequest = {userName: "user", password: "strongPassword"};
    const badUserRequest = {useram: "user", password: "strongPassword"};

    it("should successfuly verify user", () => {
        const user = verifyUserData(userRequest);

        expect(user.userName).toEqual(userRequest.userName);
        expect(user.password).toEqual(userRequest.password);
    });

    it("should unsuccessfuly verify user", () => {
        expect(() => verifyUserData(badUserRequest)).toThrow(BadRequestError);
    });

    it("should return true for proper type", () => {
        const isUser = isUserLogin(userRequest);
        expect(isUser).toEqual(true);
    });

    it("should return false for improper type", () => {
        const isUser = isUserLogin(badUserRequest);
        expect(isUser).toEqual(false);
    });
});