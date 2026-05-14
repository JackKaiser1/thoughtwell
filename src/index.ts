import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { errorMiddleware } from "./api/middleware/error-middleware.js";
import { loggingMiddleware } from "./api/middleware/logging-middleware.js";
import { handlerCreateUser } from "./api/create-user.js";
import { handlerDeleteUsers, handlerDeleteUser } from "./api/delete-user.js";
import { handlerGetUsers, handlerGetUser } from "./api/get-users.js";
import { handlerLogin } from "./api/login.js";
import { handlerCreatePage } from "./api/create-page.js";
import { handlerGetPage, handlerGetPages, handlerGetLoosePages } from "./api/get-pages.js";
import { handlerDeletePage } from "./api/delete-page.js";
import { handlerCreateNotebook } from "./api/create-notebook.js";
import { handlerGetNotebooks, handlerGetTopLevelNotebooks } from "./api/get-notebooks.js";
import { handlerAddPagesToNotebook } from "./api/add-pages-notebook.js";
import { handlerGetPagesOfNotebook } from "./api/get-pages-from-notebook.js";
import { handlerAddNotebooksToNotebook } from "./api/add-notebooks-notebooks.js";
import { handlerGetChildren } from "./api/get-notebooks-from-notebook.js";
import { handlerRefresh } from "./api/refresh-access.js";
import { authMiddleware } from "./api/middleware/auth-middleware.js";

export const app = express();
const PORT = 8080;
 
app.use(loggingMiddleware);
app.use(express.json());

app.get("/api/readiness", async (req, res, next) => {
    Promise.resolve(await handlerReadiness(req, res)).catch(next);
});


// tokens
app.post("/api/refresh", async (req, res, next) => {
    Promise.resolve(await handlerRefresh(req, res)).catch(next);
});

// pages
app.post("/api/pages", authMiddleware, async (req, res, next) => {
    Promise.resolve(await handlerCreatePage(req, res)).catch(next);
});

app.get("/api/pages/:pageId", authMiddleware, async (req, res, next) => {
    Promise.resolve(await handlerGetPage(req, res)).catch(next);
});

app.get("/api/pages", authMiddleware, async (req, res, next) => {
    Promise.resolve(await handlerGetPages(req, res)).catch(next);
});

app.delete("/api/pages/:pageId", authMiddleware, async (req, res, next) => {
    Promise.resolve(await handlerDeletePage(req, res)).catch(next);
});

app.get("/api/loosePages", async (req, res, next) => {
    Promise.resolve(await handlerGetLoosePages(req, res)).catch(next);
});


// users
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

app.post("/api/login", async (req, res, next) => {
    Promise.resolve(await handlerLogin(req, res)).catch(next);
});


// notebooks
app.post("/api/notebooks", async (req, res, next) => {
    Promise.resolve(await handlerCreateNotebook(req, res)).catch(next);
});

app.get("/api/notebooks", async (req, res, next) => {
    Promise.resolve(await handlerGetTopLevelNotebooks(req, res)).catch(next);
});

app.get("/api/notebooks/all", async (req, res, next) => {
    Promise.resolve(await handlerGetNotebooks(req, res)).catch(next);
});

app.post("/api/addPages", async (req, res, next) => {
    Promise.resolve(await handlerAddPagesToNotebook(req, res)).catch(next);
});

app.get("/api/notebooks/:notebookId/pages", async (req, res, next) => {
    Promise.resolve(await handlerGetPagesOfNotebook(req, res)).catch(next);
});

app.post("/api/notebooks/addNotebooks", async (req, res, next) => {
    Promise.resolve(await handlerAddNotebooksToNotebook(req, res)).catch(next);
});

app.get("/api/notebooks/:notebookId/children", async (req, res, next) => {
    Promise.resolve(await handlerGetChildren(req, res)).catch(next);
});



app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});