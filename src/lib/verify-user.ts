import { BadRequestError } from "../api/errors.js";
import { type UserRequestData } from "../api/login.js";

export function verifyUserData(user: unknown): UserRequestData {
    if (!isUserLogin(user)) {
        throw new BadRequestError("payload is invalid type");
    }
    
    return user;
}

export function isUserLogin(user: unknown): user is UserRequestData {
    if (!(user as UserRequestData).userName ||
        !(user as UserRequestData).password ||
        typeof (user as UserRequestData).userName !== "string" ||
        typeof (user as UserRequestData).password !== "string") {

        return false;
    }

    return true;
}