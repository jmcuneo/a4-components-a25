/* eslint-env node */
/* global process */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === ".js") {
            res.setHeader("Content-Type", "application/javascript");
        }
    },
}));

app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    const accept = req.headers.accept || "";
    if (!accept.includes("text/html")) return next();
    res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
