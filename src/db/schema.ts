import { pgTable, uuid, varchar, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core"; 

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    userName: varchar("user_name", { length: 256 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const pages = pgTable("pages", {
    id: uuid("id").primaryKey().defaultRandom(),
    pageContent: varchar("page_content", { length: 3_500 }).notNull(),
    isChild: boolean("is_child").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),  
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
});

export const notebooks = pgTable("notebooks", {
    id: uuid("id").primaryKey().defaultRandom(),
    notebookName: varchar("notebook_name", { length: 256 }).notNull(),
    isChild: boolean("is_child").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
});

export const pagesToNotebooks = pgTable("pages_to_notebooks", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    childPageId: uuid("child_page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
    parentNotebookId: uuid("parent_notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
},
    (t) => [uniqueIndex("page_of_notebook").on(t.childPageId, t.parentNotebookId)]
);

export const notebooksToNotebooks = pgTable("notebooks_to_notebooks", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    childNotebookId: uuid("child_notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
    parentNotebookId: uuid("parent_notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
}, 
    (t) => [uniqueIndex("notebooks_of_notebooks").on(t.childNotebookId, t.parentNotebookId)]
);

export type UserRecord = typeof users.$inferInsert;
export type PageRecord = typeof pages.$inferInsert;
export type NotebookRecord = typeof notebooks.$inferInsert;
export type PagesToNotebooksRecord = typeof pagesToNotebooks.$inferInsert;
export type NotebooksToNotebooksRecord = typeof notebooksToNotebooks.$inferInsert;