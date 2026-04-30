import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core"; 

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

export type UserRecord = typeof users.$inferInsert;
export type PageRecord = typeof pages.$inferInsert;