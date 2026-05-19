import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { db, dbClient } from "../db/index.js";
import { getChildren, TopLevelChildren } from "../db/queries/notebooks-to-notebooks.js";
import { PageRecord } from "../db/schema.js";
import { getPage } from "../db/queries/pages.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { getNotebook } from "../db/queries/notebooks.js";

type ChildrenOfNotebook = {
    [key: string] : string | ChildrenOfNotebook;
    notebookName: string;
}

// export async function handlerGetAllChildrenFromNotebook(req: Request, res: Response) {
//     const notebookId = verifyUUID(req.params.notebookId);

//     const children = new Map();
//     await fetchAllChildren(db, notebookId, children);

//     res.status(200).json(children);
// }

const children = new Map();

export async function fetchAllChildren(client: dbClient, notebookId: string, children: Map<any, any>) {
    const nextLevelChildren = await getChildren(client, notebookId);
    if (nextLevelChildren.notebookChildren.length === 0) {
        return;
    }

    let notebookContent: {[key: string]: any} = {};

    const notebookRecord = await getNotebook(client, notebookId);
    const notebookName = notebookRecord.notebookName;

    notebookContent["notebookId"] = notebookId;

    const pageQueryPromises: Promise<PageRecord>[] = [];
    for (const pageJunctionRecords of nextLevelChildren.pageChildren) {
        pageQueryPromises.push(getPage(client, pageJunctionRecords.childPageId));
    }
    const pageChildren = await Promise.all(pageQueryPromises);

    for (const page of pageChildren) {
        if (page.id) notebookContent[page.id] = page.pageContent;
    }

    // const notebookQueryPromises: Promise<TopLevelChildren>[] = [];
    // for (const notebookJunctionRecords of nextLevelChildren.notebookChildren) {
    //     const nextNotebookId = notebookJunctionRecords.parentNotebookId;
        
    //     const nextNotebookRecord = await getNotebook(db, nextNotebookId);
    //     notebookQueryPromises.push(getChildren(db, nextNotebookId));
    // }
    // const notebookContents = await Promise.all(notebookQueryPromises);

    children.set(notebookName, notebookContent);
}

await fetchAllChildren(db, "2235d008-54cc-40f7-b3d5-75fb02779657", children);
console.log(children);