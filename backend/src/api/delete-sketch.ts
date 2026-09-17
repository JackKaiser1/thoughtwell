import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "./errors.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { db } from "../db/index.js";
import { s3 } from "../index.js";
import { deleteSketch, getSketch } from "../db/queries/sketches.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function handlerDeleteSketch(req: Request, res: Response) {
    const unverifiedSketchId = req.params.sketchId;

    if (!unverifiedSketchId) {
        throw new BadRequestError("Must provided sketch id as path parameter");
    }

    const sketchId = verifyUUID(unverifiedSketchId);
    const sketchMetadataRecord = await getSketch(db, sketchId);
    const userId = verifyUUID(res.locals.userId);
    
    if (userId !== sketchMetadataRecord.userId) {
        throw new ForbiddenError("User is not authorized to delete this resource");
    }

    const deleteCommand = new DeleteObjectCommand({
        Bucket: "sketches",
        Key: sketchMetadataRecord.sketchKey
    });

    s3.send(deleteCommand);

    await deleteSketch(db, sketchId);

    res.status(204).send();
}