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

if (!process.env.MODE) {
    throw new Error("Mode string not found");
}

if (!process.env.MINIO_ROOT_USER) {
    throw new Error("Minio username string not found");
}

if (!process.env.MINIO_ROOT_PASSWORD) {
    throw new Error("Minio password string not found");
}

type Config = {
    migrationConfig: MigrationConfig;
    dbURL: string;
    secret: string;
    apiKey: string;
    mode: string;
    s3AccessKeyId: string;
    s3SecretAccessKey: string;
}

export const config: Config = {
    migrationConfig: {
        migrationsFolder: "./src/db/migrations",
    },
    dbURL: process.env.DB_URL,
    secret: process.env.SECRET,
    apiKey: process.env.API_KEY,
    mode: process.env.MODE,
    s3AccessKeyId: process.env.MINIO_ROOT_USER,
    s3SecretAccessKey: process.env.MINIO_ROOT_PASSWORD
}
