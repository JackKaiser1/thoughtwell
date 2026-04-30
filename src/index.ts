import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { errorMiddleware } from "./api/middleware/error-middleware.js";
import { handlerAddPage } from "./api/pages.js";
import { loggingMiddleware } from "./api/middleware/logging-middleware.js";


import postgres from "postgres";
import { config } from "./config.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { handlerCreateUser } from "./api/create-user.js";
import { handlerDeleteUsers, handlerDeleteUser } from "./api/delete.js";
import { handlerGetUsers, handlerGetUser } from "./api/get-users.js";

// const migrationConn = postgres(config.dbURL, { max: 1 });
// await migrate(drizzle(migrationConn), config.migrationConfig);


export const app = express();
const PORT = 8080;
 
app.use(loggingMiddleware);
app.use(express.json());

app.get("/api/readiness", async (req, res, next) => {
    Promise.resolve(await handlerReadiness(req, res)).catch(next);
});

app.post("/api/pages", async (req, res, next) => {
    Promise.resolve(await handlerAddPage(req, res)).catch(next);
});

app.post("/api/users", async (req, res, next) => {
    Promise.resolve(await handlerCreateUser(req, res)).catch(next);
});

app.delete("/api/users", async (req, res, next) => {
    Promise.resolve(await handlerDeleteUsers(req, res)).catch(next);
});

app.delete("/api/users/:userId", async (req, res, next) => {
    Promise.resolve(await handlerDeleteUser(req, res)).catch(next);
});

app.get("/api/users", async (req, res, next) => {
    Promise.resolve(await handlerGetUsers(req, res)).catch(next);
});

app.get("/api/users/:userId", async (req, res, next) => {
    Promise.resolve(await handlerGetUser(req, res)).catch(next);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});