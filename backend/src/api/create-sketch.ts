import { Request, Response } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { s3 } from "../index.js";
import { config } from "../config.js";
import { BadRequestError } from "./errors.js";

export async function handlerCreateSketch(req: Request, res: Response) {
    if (!req.file) {
        throw new BadRequestError("Invalid file uploaded");
    }

    const command = new PutObjectCommand({
        Bucket: "sketches",
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: "image/png"
    });

    const response = await s3.send(command);
    console.log(response);
    res.send({message: "OK"}).status(201);
}