import { Request, Response } from "express";
import { verifyUUID } from "../lib/verify-uuid.js";
import { getSketch, makeChildSketch } from "../db/queries/sketches.js";
import { addChildrenToNotebook } from "../lib/add-children.js";
import { verifyChildrenToAdd } from "../lib/verify-childrenToAdd.js";
import { db } from "../db/index.js";
import { createSketchesToNotebooks, deleteSketchesToNotebooks } from "../db/queries/sketches-to-notebooks.js";

export async function handlerAddSketchesToNotebook(req: Request, res: Response) {
    const authenticatedUserId = verifyUUID(res.locals.userId);
    const authorizedPayload = await verifyChildrenToAdd(db, req.body, authenticatedUserId, getSketch);
    
    const childParentRecords = await addChildrenToNotebook(
        db, 
        authorizedPayload, 
        deleteSketchesToNotebooks, 
        createSketchesToNotebooks, 
        makeChildSketch
    );

    res.json(childParentRecords).status(201);
}