import { type PageRecord, pages, users } from "../schema.js";
import { type dbClient, db} from "../index.js";
import { eq } from "drizzle-orm";

export type PageQuery = Omit<PageRecord, "createdAt" | "updatedAt" | "id" | "isChild">;

export async function createPage(client: dbClient, page: PageQuery) {
    const [pageRecord] = await client 
                            .insert(pages)
                            .values(page)
                            .returning();
    return pageRecord;
}

export async function getPage(client: dbClient, pageId: string) {
    const [pageRecord] = await client
                                    .select()
                                    .from(pages)
                                    .where(eq(pages.id, pageId));
    return pageRecord;
}

export async function getPages(client: dbClient, userId: string) {
    const pageRecords = await client 
                                    .select()
                                    .from(pages)
                                    .where(eq(pages.userId, userId));
    return pageRecords;
}

export async function deletePage(client: dbClient, pageId: string) {
    await client
            .delete(pages)
            .where(eq(pages.id, pageId));
}