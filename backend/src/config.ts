import { env } from "node:process";
import { type MigrationConfig } from "drizzle-orm/migrator";
 
// process.loadEnvFile("../.env")

if (!process.env.DB_URL) {
    throw new Error("Database connection string not found");
}

if (!process.env.SECRET) {
    throw new Error("Secret string not found");
}

if (!process.env.API_KEY) {
    throw new Error("API key string not found");
}


type Config = {
    migrationConfig: MigrationConfig;
    dbURL: string;
    secret: string;
    apiKey: string;
}

export const config: Config = {
    migrationConfig: {
        migrationsFolder: "./src/db/migrations",
    },
    dbURL: process.env.DB_URL,
    secret: process.env.SECRET,
    apiKey: process.env.API_KEY,
}
