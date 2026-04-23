import { BadRequestError } from "../api/errors.js";


export type UserRequestData = {
    userName: string,
    password: string,
}

export function verifyUserData(user: UserRequestData): UserRequestData {
    const userName = user.userName;
    if (!userName) {
        throw new BadRequestError("User must have username");
    }

    const password = user.password;
    if (!password) {
        throw new BadRequestError("User must have password");
    }

    return user;
}