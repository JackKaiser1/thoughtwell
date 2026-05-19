import { Request, Response, NextFunction } from "express";
import { verifyJWT, getBearerToken } from "../auth/jwt.js";
import { config } from "../../config.js";
import { BadRequestError, UnauthorizedError } from "../errors.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        throw new BadRequestError("Must provide access token in header");
    }
    const token = getBearerToken(req.headers.authorization);

    const userId = verifyJWT(token, config.secret); 
    res.locals.userId = userId;

    next();
}

export async function apiKeyAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        throw new BadRequestError("Must provide API key in header");
    }

    const apiKey = config.apiKey;
    const apiKeyRequest = getBearerToken(req.headers.authorization);

    if (apiKeyRequest !== apiKey) {
        throw new UnauthorizedError("User not authorized to this resource");
    }

    next();
}
    
