import { BadRequestError } from "../api/errors.js";
import { verifyUUID } from "./verify-uuid.js";
import { type PagesToNotebooksRecord, 
         type NotebooksToNotebooksRecord,  
         type PageRecord,
         type NotebookRecord} from "../db/schema.js";
import { type dbClient, db } from "../db/index.js";
import { NotebooksToNotebooksQuery } from "../db/queries/notebooks-to-notebooks.js";
import { PagesToNotebooksQuery } from "../db/queries/pages-to-notebooks.js";
import { createNotebooksToNotebooks, deleteNotebooksToNotebooks} from "../db/queries/notebooks-to-notebooks.js";
import { createPagesToNotebooks, deletePagesToNotebooks } from "../db/queries/pages-to-notebooks.js";
import { makeChildPage } from "../db/queries/pages.js";
import { makeChildNotebook } from "../db/queries/notebooks.js";

export type ChildrenToAdd = {
    typeOfChild: "pages" | "notebooks",
    childIds: string[];
    notebookId: string;
    userId: string;
}


type AddChildrenQueryFunc = typeof createPagesToNotebooks | typeof createNotebooksToNotebooks;

type makeChildQueryFunc = typeof makeChildPage | typeof makeChildNotebook;

type DeleteQuery = typeof deletePagesToNotebooks | typeof deleteNotebooksToNotebooks;


export async function addChildrenToNotebook(client: dbClient, 
                               payload: unknown,
                               deleteQueryFunc: DeleteQuery,
                               addChildrenQueryFunc: typeof createPagesToNotebooks,
                               makeChildrenQueryFunc: typeof makeChildPage): Promise<PagesToNotebooksRecord[]>;

export async function addChildrenToNotebook(client: dbClient, 
                               payload: unknown,
                               deleteQueryFunc: DeleteQuery,
                               addChildrenQueryFunc: typeof createNotebooksToNotebooks,
                               makeChildrenQueryFunc: typeof makeChildNotebook): Promise<NotebooksToNotebooksRecord[]>;



export async function addChildrenToNotebook(client: dbClient, 
                                            payload: unknown, 
                                            deleteQueryFunc: DeleteQuery,
                                            addChildrenQueryFunc: AddChildrenQueryFunc,
                                            makeChildrenQueryFunc: makeChildQueryFunc) {
                                                
    const childrenToAdd = verifyChildrenToAdd(payload);
    await removePriorRelationships(client, deleteQueryFunc, childrenToAdd);
    const childParentRecords = await addChildrenQuery(client, childrenToAdd, addChildrenQueryFunc);
    await makeChildren(client, childrenToAdd.childIds, makeChildrenQueryFunc);

    return childParentRecords
}



export function verifyChildrenToAdd(childrenToAdd: unknown): ChildrenToAdd {
    if (!isChildrenToAdd(childrenToAdd)) {
        throw new BadRequestError("payload is invalid type");
    }

    const typeOfChild = childrenToAdd.typeOfChild;
    const userId = verifyUUID(childrenToAdd.userId);
    const notebookId = verifyUUID(childrenToAdd.notebookId);

    const childIds: string[] = [];
    for (const id of childrenToAdd.childIds) {
        const childId = verifyUUID(id);
        childIds.push(childId);
    }

    return {
        typeOfChild: typeOfChild,
        userId: userId,
        notebookId: notebookId,
        childIds: childIds,
    }
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


export async function removePriorRelationships(client: dbClient, deleteQuery: DeleteQuery, childrenToAdd: ChildrenToAdd) {
    const queryPromises: Promise<void>[] = [];

    for (const id of childrenToAdd.childIds) {

        queryPromises.push(deleteQuery(client, id));
    }

    Promise.all(queryPromises);
}


export async function addChildrenQuery(client: dbClient, childrenToAdd: ChildrenToAdd, queryFunc: any) {
    const queryPromises: Promise<PagesToNotebooksRecord | NotebooksToNotebooksRecord>[] = [];

    for (const id of childrenToAdd.childIds) {
        let childParentQuery: PagesToNotebooksQuery | NotebooksToNotebooksQuery;

        if (childrenToAdd.typeOfChild === "pages") {
            childParentQuery = {
                    userId: childrenToAdd.userId,
                    parentNotebookId: childrenToAdd.notebookId,
                    childPageId: id,
            }
        } else if (childrenToAdd.typeOfChild === "notebooks") {
            childParentQuery = {
                    userId: childrenToAdd.userId,
                    parentNotebookId: childrenToAdd.notebookId,
                    childNotebookId: id,
            }
        } else {
            throw new BadRequestError("Payload invalid");
        }

        if ("childPageId" in childParentQuery) {
            queryPromises.push(queryFunc(client, childParentQuery));
        } else if ("childNotebookId" in childParentQuery) {
            queryPromises.push(queryFunc(client, childParentQuery));
        }

    }

    const childParentRecords = await Promise.all(queryPromises);

    if (childrenToAdd.typeOfChild === "pages") {
        for (const record of childParentRecords) {
            if (!isPagesToNotebooksRecord(record)) {
                throw new BadRequestError("payload improperly typed");
            }
        }
    }

    else if (childrenToAdd.typeOfChild === "notebooks") {
        for (const record of childParentRecords) {
            if (!isNotebooksToNotebooksRecord(record)) {
                throw new BadRequestError("payload improperly typed");
            }
        }
    }

    return childParentRecords;
}


export function isPagesToNotebooksRecord(obj: unknown): obj is PagesToNotebooksRecord {
    if ((obj as PagesToNotebooksRecord).id === undefined ||
        (obj as PagesToNotebooksRecord).userId === undefined ||
        (obj as PagesToNotebooksRecord).parentNotebookId === undefined ||
        (obj as PagesToNotebooksRecord).childPageId === undefined || 
        (obj as PagesToNotebooksRecord).createdAt === undefined ||
        (obj as PagesToNotebooksRecord).updatedAt === undefined) {
            return false
        };

    return true;
}

export function isNotebooksToNotebooksRecord(obj: unknown): obj is NotebooksToNotebooksRecord {
    if ((obj as NotebooksToNotebooksRecord).id === undefined ||
        (obj as NotebooksToNotebooksRecord).userId === undefined ||
        (obj as NotebooksToNotebooksRecord).parentNotebookId === undefined ||
        (obj as NotebooksToNotebooksRecord).childNotebookId === undefined ||
        (obj as NotebooksToNotebooksRecord).createdAt === undefined ||
        (obj as NotebooksToNotebooksRecord).updatedAt === undefined) {
            return false;
        }

    return true;
}




export async function makeChildren(client: dbClient, childIds: string[], queryFunc: makeChildQueryFunc) {
    const queryPromises: Promise<PageRecord | NotebookRecord>[] = [];

    for (const id of childIds) {
        queryPromises.push(queryFunc(client, id));
    }

    return await Promise.all(queryPromises);
}

