import { env } from "node:process";
import { type MigrationConfig } from "drizzle-orm/migrator";
 
process.loadEnvFile()

if (!process.env.DB_URL) {
    throw new Error("Database connection string not found");
}


type Config = {
    migrationConfig: MigrationConfig;
    dbURL: string;
}

export const config: Config = {
    migrationConfig: {
        migrationsFolder: "./src/db/migrations",
    },
    dbURL: process.env.DB_URL,
}
