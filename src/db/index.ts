import postgres from "postgres";
import { config } from "../config.js";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { PgDatabase, PgTransaction } from "drizzle-orm/pg-core";

const conn = postgres(config.dbURL);
export const db = drizzle(conn, { schema });
 
export type dbClient = PostgresJsDatabase | PgTransaction<any, any, any> | PgDatabase<any, any, any>;