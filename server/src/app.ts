import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

// API routes should stay ABOVE static serving
import routes from "./routes";
app.use("/api", routes);

// Handle 404 for API routes defined under /api
app.use("/api/*", notFoundHandler);

// Serve frontend build
const clientPath = path.join(__dirname, "../../client/dist");

app.use(express.static(clientPath));

// SPA fallback
app.get("*", (_, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

// Global error handler
app.use(errorHandler);

export default app;
