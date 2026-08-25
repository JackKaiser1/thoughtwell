import { Request, Response } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { s3 } from "../index.js";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError } from "./errors.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { createSketch, SketchQuery } from "../db/queries/sketches.js";
import { db } from "../db/index.js";

export async function handlerCreateSketch(req: Request, res: Response) {
    if (!req.file) {
        throw new BadRequestError("Invalid file uploaded");
    }

    const userId = verifyUUID(res.locals.userId);
    const sketchKey = req.file.originalname;

    const command = new PutObjectCommand({
        Bucket: "sketches",
        Key: sketchKey,
        Body: req.file.buffer,
        ContentType: "image/png"
    });

    const response = await s3.send(command);
    console.log(response);

    const sketchQuery: SketchQuery = {
        userId: userId,
        sketchKey: sketchKey,
    }

    const sketchRecord = await createSketch(db, sketchQuery);
    if (!sketchRecord) {
        throw new Error("Failed to create sketch record");
    }

    res.json(sketchRecord).status(201);
}