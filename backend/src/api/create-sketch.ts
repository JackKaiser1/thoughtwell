import { Request, Response } from "express";

export async function handlerCreateSketch(req: Request, res: Response) {
    if (req.file) {
        res.send({message: "OK"}).status(201);
    }
}