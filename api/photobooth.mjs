import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { loadLocalEnv } from "../server/ticketing-bridge.mjs";

function sanitizeSegment(raw, maxLen = 40) {
  return String(raw || "")
    .trim()
    .replace(/[^0-9A-Za-z가-힣_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
}

function formatKstFolderAndStamp() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(kst.getUTCDate()).padStart(2, "0");
  const hh = String(kst.getUTCHours()).padStart(2, "0");
  const mi = String(kst.getUTCMinutes()).padStart(2, "0");
  const ss = String(kst.getUTCSeconds()).padStart(2, "0");
  return {
    dateFolder: `${yyyy}-${mm}-${dd}`,
    timeStamp: `${hh}${mi}${ss}`,
  };
}

export async function archivePhotoboothImage(body) {
  loadLocalEnv();

  const imageDataUrl = String(body?.imageDataUrl || "").trim();
  const match = imageDataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    return { ok: false, skipped: true, reason: "INVALID_IMAGE_DATA" };
  }

  const contentType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, "base64");

  // Cap at 6 MB
  if (buffer.length < 1000 || buffer.length > 6 * 1024 * 1024) {
    return { ok: false, skipped: true, reason: "IMAGE_SIZE_OUT_OF_RANGE" };
  }

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const show = sanitizeSegment(body?.show || "muborn", 20) || "muborn";
  const themeKey = sanitizeSegment(body?.themeKey || "default", 24) || "default";
  const partners = Array.isArray(body?.partners)
    ? body.partners.map((p) => sanitizeSegment(p, 16)).filter(Boolean).join("_")
    : "";
  const partnerSlug = partners || "cast";

  const { dateFolder, timeStamp } = formatKstFolderAndStamp();
  const rand = Math.random().toString(36).slice(2, 7);
  const fileName = `${timeStamp}_${show}_${themeKey}_${partnerSlug}_${rand}.${ext}`;
  const blobPathname = `muborn-4cut/${dateFolder}/${fileName}`;

  const hasVercelBlobEnv = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL ||
      Object.keys(process.env).some((k) => k.includes("BLOB"))
  );

  if (hasVercelBlobEnv) {
    // Try private first (since private stores use OIDC + BLOB_STORE_ID), then public fallback
    try {
      const blob = await put(blobPathname, buffer, {
        access: "private",
        contentType,
        addRandomSuffix: false,
      });
      return {
        ok: true,
        storage: "vercel-blob-private",
        pathname: blob.pathname,
      };
    } catch {
      try {
        const blob = await put(blobPathname, buffer, {
          access: "public",
          contentType,
          addRandomSuffix: false,
        });
        return {
          ok: true,
          storage: "vercel-blob-public",
          pathname: blob.pathname,
        };
      } catch (err) {
        return {
          ok: false,
          skipped: true,
          reason: err instanceof Error ? err.message : "BLOB_UPLOAD_FAILED",
        };
      }
    }
  }

  // Fallback for local server without BLOB_READ_WRITE_TOKEN
  try {
    const localDir = path.join(process.cwd(), "data", "photobooth", dateFolder);
    fs.mkdirSync(localDir, { recursive: true });
    fs.writeFileSync(path.join(localDir, fileName), buffer);
    return {
      ok: true,
      storage: "local-fs",
      pathname: `data/photobooth/${dateFolder}/${fileName}`,
    };
  } catch {
    return { ok: false, skipped: true, reason: "NO_BLOB_TOKEN_CONFIGURED" };
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const result = await archivePhotoboothImage(body);
    res.status(200).json(result);
  } catch {
    // Always return 200 so background archiving never surfaces errors to end users
    res.status(200).json({ ok: false, skipped: true });
  }
}
