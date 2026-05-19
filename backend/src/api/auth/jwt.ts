import jwt, { type JwtPayload } from "jsonwebtoken";
import { BadRequestError } from "../errors.js";

export type JWTPayload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function createJWT(userId: string, expiresInS: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
        iss: "ThoughtWell",
        sub: userId,
        iat: issuedAt,
        exp: issuedAt + expiresInS
    };

    return jwt.sign(payload, secret);
}

export function verifyJWT(token: string, secret: string): string {
    try {
        const payload = jwt.verify(token, secret);

        if (typeof payload === "string") {
            throw new BadRequestError("payload cannot be string");
        }

        if (!payload.sub) {
            throw new BadRequestError("token is invalid");
        }
        
        const userId = payload.sub;
        return userId;
        
    } catch (err) {
        if (err instanceof Error) {
            throw new BadRequestError("token has expired or is invalid");
        } else {
            throw new Error(`Error: ${err}`);
        }
    }
}

export function getBearerToken(bearerTokenString: string) {
    return bearerTokenString.replace("Bearer", "").trim();
}
