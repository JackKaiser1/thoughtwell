import { Request, Response, NextFunction } from "express";

export async function loggingMiddleware(req: Request, res: Response, next: NextFunction ) {
    res.on("finish", () => {
        const status = res.statusCode;
        const message = res.statusMessage;
        const timeStamp = new Date().toLocaleTimeString();
        console.log(`${timeStamp} - ${status}: ${message}`);
    });
    
    next();
}