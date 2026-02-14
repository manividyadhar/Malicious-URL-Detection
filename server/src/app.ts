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
// Path adjusted for production runtime in dist/src/
const clientDistPath = path.join(__dirname, "../../../client/dist");

app.use(express.static(clientDistPath));

// SPA fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
});

export default app;
