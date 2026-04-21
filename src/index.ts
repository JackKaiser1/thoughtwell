import express from "express";
import { handlerReadiness } from "./api/readiness";

const app = express();
const PORT = 8080;

app.get("/api/readiness", async (req, res) => {
    await handlerReadiness(req, res);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});