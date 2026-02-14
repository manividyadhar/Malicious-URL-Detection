import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// API routes should stay ABOVE static serving
import routes from "./routes";
app.use("/api", routes);

// Serve frontend build
const clientPath = path.join(__dirname, "../../client/dist");

app.use(express.static(clientPath));

// SPA fallback
app.get("*", (_, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

export default app;
