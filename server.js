import express from "express";
import path from "path";
import fs from "fs";
import dns from "dns";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import chatHandler from "./api/chat.js";

// Set default DNS resolution to prefer IPv4 to prevent AggregateError [ENOBUFS]
if (dns && typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually if it exists (for local development/offline runs)
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const delimiterIdx = trimmed.indexOf("=");
        const key = trimmed.substring(0, delimiterIdx).trim();
        let value = trimmed.substring(delimiterIdx + 1).trim();
        // Remove surrounding quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.substring(1, value.length - 1);
        }
        if (!process.env[key] || process.env[key] === "" || process.env[key] === "undefined") {
          process.env[key] = value;
        }
      }
    });
    console.log("[Server] Loaded environment variables from .env successfully.");
  }
} catch (err) {
  console.warn("[Server] Could not load .env file:", err.message);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON
  app.use(express.json());

  // Request logging middleware for debugging
  app.use((req, res, next) => {
    const logLine = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    try {
      fs.appendFileSync(path.join(process.cwd(), "server.log"), logLine);
    } catch (e) {
      // Ignore
    }
    console.log(`[Server Log] ${req.method} ${req.url}`);
    next();
  });

  // API routes FIRST
  app.use("/api/chat", chatHandler);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
