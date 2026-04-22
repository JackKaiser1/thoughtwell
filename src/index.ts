import express from "express";
import { handlerReadiness } from "./api/readiness";
import { errorMiddleware } from "./api/middleware/error-middleware";
import { handlerAddPage } from "./api/pages";
import { loggingMiddleware } from "./api/middleware/logging-middleware";

const app = express();
const PORT = 8080;
 
app.use(loggingMiddleware);
app.use(express.json());

app.get("/api/readiness", async (req, res, next) => {
    Promise.resolve(await handlerReadiness(req, res)).catch(next);
});

app.post("/api/pages", async (req, res, next) => {
    Promise.resolve(await handlerAddPage(req, res)).catch(next);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});