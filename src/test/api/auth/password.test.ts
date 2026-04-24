import { expect, describe, it } from "vitest";
import { verifyHash, hashPassword, checkPasswordEntropy, processPassword } from "../../../api/auth/password.js";

describe("hashPassword", () => {
    it("should successfully hash password", async () => {
        const plainText = "password123";
        const hash = await hashPassword(plainText);
        
        expect(hash === plainText).toBeFalsy()
    });

    it("should create two different hashes for the same string", async () => {
        const plainText = "strongpassword10";
        const hash1 = await hashPassword(plainText);
        const hash2 = await hashPassword(plainText);

        expect(hash1 === hash2).toBeFalsy();
    });
});

describe("verifyPassword", () => {
    it("should successfully verify password", async () => {
        const plainText = "strongpassword20";
        const hash = await hashPassword(plainText);
        const isSame = await verifyHash(hash, plainText);

        expect(isSame).toBeTruthy();
    });

    it("should throw error for wrong password", async () => {
        const plainText = "strongpasswordq2e";
        const wrongPassword = "strongpa";
        const hash = await hashPassword(plainText);

        async function isNotSame() {
            const isSame = await verifyHash(hash, wrongPassword);
            return isSame;
        }
        
        await expect(isNotSame()).rejects.toThrow();
    });
});

describe("checkPasswordEntropy", () => {
    it("should successfully check password entropy", () => {
        const password = "thisisastrongenoughpassword";
        const isValid = checkPasswordEntropy(password);

        expect(isValid).toBeTruthy();
    });

    it("should throw error due to invalid password length", () => {
        const password = "tooshort";
          
        expect(() => checkPasswordEntropy(password)).toThrow();
    });
});

describe("processPassword", () => {
    it("should assert plaintext and hash are not equal", async () => {
        const password = "goodpassword1010alday";
        const hash = await processPassword(password);

        expect(hash === password).toBeFalsy();
    });

    it("should assert plaintext can be verifed against hash", async () => {
        const password = "goodpassword1010alday";
        const hash = await processPassword(password);
        const isSame = await verifyHash(hash, password);

        expect(isSame).toBeTruthy();
    });
});