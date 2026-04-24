import argon2 from "argon2";
import { BadRequestError, UnauthorizedError } from "../errors.js";
import { PasswordCharMin } from "../api-constants.js";

export async function processPassword(password: string) {   
    checkPasswordEntropy(password);
    const hash = await hashPassword(password);
    
    return hash;
}

export function checkPasswordEntropy(password: string): boolean {
    const length = password.length;
    if (length < PasswordCharMin) {
        throw new BadRequestError("Password is too short");
    }
    return true;
}


export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        console.log("Hashing failed");
        throw new Error("Internal failure");
    }
}

export async function verifyHash(hash: string, password: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        } else {
            throw new UnauthorizedError("Incorrect password");
        }
    } catch (err) {
        console.log("Hashing failed");
        throw new UnauthorizedError("Incorrect password");
    }
}