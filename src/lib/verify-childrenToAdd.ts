import { BadRequestError, UnauthorizedError } from "../api/errors.js";
import { verifyUUID } from "./verify-uuid.js";
import { type ChildrenToAdd } from "./add-children.js";
import { getNotebook } from "../db/queries/notebooks.js";
import { type dbClient } from "../db/index.js";
import { type PageRecord } from "../db/schema.js";
import { getPage } from "../db/queries/pages.js";


export async function verifyChildrenToAdd(client: dbClient, childrenToAdd: unknown, authenticatedUserId: string): Promise<ChildrenToAdd> {
    if (!isChildrenToAdd(childrenToAdd)) {
        throw new BadRequestError("Payload is invalid type");
    }

    verifyUUID(childrenToAdd.userId);
    verifyUUID(childrenToAdd.notebookId);

    for (const id of childrenToAdd.childIds) {
        verifyUUID(id);
    }

   return await authorizeNotebookEdit(client, childrenToAdd, authenticatedUserId);
}

export function isChildrenToAdd(obj: unknown): obj is ChildrenToAdd {
    if ((obj as ChildrenToAdd).userId === undefined) return false;
    if ((obj as ChildrenToAdd).notebookId === undefined) return false;
    if ((obj as ChildrenToAdd).typeOfChild === undefined) return false;
    if ((obj as ChildrenToAdd).childIds === undefined) return false;
    
    if (typeof (obj as ChildrenToAdd).userId !== "string") return false
    if (typeof (obj as ChildrenToAdd).notebookId !== "string") return false;
    if ((obj as ChildrenToAdd).typeOfChild !== "pages" &&
        (obj as ChildrenToAdd).typeOfChild !== "notebooks") return false; 

    for (const id of (obj as ChildrenToAdd).childIds) {
        if (id === undefined) return false;
        if (typeof id !== "string") return false;
    }

    return true;
}

export async function authorizeNotebookEdit(client: dbClient, childrenToAdd: ChildrenToAdd, authenticatedUserId: string) {
    const {typeOfChild, userId, notebookId, childIds} = childrenToAdd;

    const errMessage = "User is not authorized to edit notebook";

    if (authenticatedUserId !== userId) {
        throw new UnauthorizedError(errMessage);
    }
 
    const notebookRecord = await getNotebook(client, notebookId);
    if (authenticatedUserId !== notebookRecord.userId) {
        throw new UnauthorizedError(errMessage);
    }

    const queryPromises = [];
    for (const id of childIds) {

        if (typeOfChild === "pages") {
            queryPromises.push(getPage(client, id));
        } 
        else if (typeOfChild === "notebooks") {
            queryPromises.push(getNotebook(client, id));
        }

    }

    const childRecords = await Promise.all(queryPromises);
    for (const record of childRecords) {
        
        if (record === undefined) {
            throw new BadRequestError("typeOfChild property is incorrect");
        }

        if (authenticatedUserId !== record.userId) {
            throw new UnauthorizedError(errMessage);
        }
    }

    return childrenToAdd;
}