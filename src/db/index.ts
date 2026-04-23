import postgres from "postgres";
import { config } from "../config.js";
import { drizzle } from "drizzle-orm/node-postgres";

const conn = postgres(config.dbURL);
export const db = drizzle(postgres);
 