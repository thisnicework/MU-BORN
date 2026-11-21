import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { handleApiRequest } from "./api.mjs";

const DIST_DIR = path.join(process.cwd(), "dist");
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

function serveStaticFile(req, res, filePath) {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  // Range request support for MP4 streaming
  const range = req.headers.range;
  if (range && ext === ".mp4") {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunkSize = end - start + 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": contentType,
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stat.size,
    "Accept-Ranges": "bytes",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.url && req.url.startsWith("/api/")) {
    const handled = await handleApiRequest(req, res);
    if (handled) return;
  }

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  let target = path.join(DIST_DIR, safePath);

  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    serveStaticFile(req, res, target);
    return;
  }

  // SPA fallback to dist/index.html
  const indexHtml = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(indexHtml)) {
    serveStaticFile(req, res, indexHtml);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not built yet. Run npm run build first.");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`MU:BORN 2026 server running on http://localhost:${PORT}`);
});
