import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "../errors.js";

export async function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof BadRequestError) {
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof UnauthorizedError) {
        res.status(401).json({ error: err.message });
    }
    else if (err instanceof ForbiddenError) {
        res.status(403).json({ error: err.message });
    }
    else if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
    }
    else {
        if (err.message.includes("JSON")) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "Something went wrong" });
            console.log(`Error: ${err.message}, Cause: ${err.cause}`);
        }
    }
}