import { Request, Response, NextFunction } from "express";
import { verifyJWT, getBearerToken } from "../auth/jwt.js";
import { config } from "../../config.js";
import { BadRequestError } from "../errors.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        throw new BadRequestError("request must provide access token in header");
    }
    const token = getBearerToken(req.headers.authorization);

    const userId = verifyJWT(token, config.secret); 
    res.locals.userId = userId;

    next();
}