import express from "express";
import path from "path";
import fs from "fs";
import dns from "dns";
import compression from "compression";
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

  // Compress all responses
  app.use(compression());

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

  // Explicit handlers for sitemap.xml and robots.txt
  app.get("/sitemap.xml", (req, res) => {
    const sitemapPath = process.env.NODE_ENV === "production"
      ? path.join(process.cwd(), "dist", "sitemap.xml")
      : path.join(process.cwd(), "public", "sitemap.xml");
    
    if (fs.existsSync(sitemapPath)) {
      res.header("Content-Type", "application/xml");
      res.sendFile(sitemapPath);
    } else {
      // Fallback to checking public folder directly if dist is not updated yet
      const publicSitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
      if (fs.existsSync(publicSitemapPath)) {
        res.header("Content-Type", "application/xml");
        res.sendFile(publicSitemapPath);
      } else {
        res.status(404).send("Sitemap not found");
      }
    }
  });

  app.get("/robots.txt", (req, res) => {
    const robotsPath = process.env.NODE_ENV === "production"
      ? path.join(process.cwd(), "dist", "robots.txt")
      : path.join(process.cwd(), "public", "robots.txt");
    
    if (fs.existsSync(robotsPath)) {
      res.header("Content-Type", "text/plain");
      res.sendFile(robotsPath);
    } else {
      const publicRobotsPath = path.join(process.cwd(), "public", "robots.txt");
      if (fs.existsSync(publicRobotsPath)) {
        res.header("Content-Type", "text/plain");
        res.sendFile(publicRobotsPath);
      } else {
        res.status(404).send("Robots.txt not found");
      }
    }
  });

  app.get("/sitemap", (req, res) => {
    res.redirect(301, "/sitemap.xml");
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
    app.use(express.static(distPath, {
      maxAge: '1y',
      etag: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          // Do not cache html file so updates are seen instantly
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          // Cache JS, CSS, images, fonts aggressively (1 year)
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
