import { env } from "node:process";

if (!env.DB_URL) {
    throw new Error("Database connection string not found");
}


type Config = {
    dbURL: string;
}

export const config: Config = {
    dbURL: env.DB_URL,
}
