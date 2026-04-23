import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core"; 

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    userName: varchar("user_name", { length: 256 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type UserRecord = typeof users.$inferInsert;