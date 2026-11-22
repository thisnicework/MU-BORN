import crypto from "node:crypto";
import { loadLocalEnv } from "./ticketing-bridge.mjs";

const COOKIE_NAME = "muborn_admin_session";

function getAdminConfig() {
  loadLocalEnv();
  return {
    secret: process.env.ADMIN_SECRET || "muborn-2026-sia-secret-key-v1",
    password: process.env.ADMIN_PASSWORD || "jonji1122",
  };
}

function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function parseCookies(req) {
  const header = req.headers?.cookie || "";
  const map = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    try {
      map[k] = decodeURIComponent(v);
    } catch {
      map[k] = v;
    }
  }
  return map;
}

export function isAdminAuthenticated(req) {
  const { secret } = getAdminConfig();
  const cookies = parseCookies(req);
  const raw = cookies[COOKIE_NAME];
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  if (sig.length !== expected.length) return false;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}

export function verifyAdminPassword(input) {
  const { password } = getAdminConfig();
  const a = Buffer.from(String(input || ""));
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createAdminSessionCookie(req) {
  const { secret } = getAdminConfig();
  const exp = String(Date.now() + 1000 * 60 * 60 * 12);
  const token = `${exp}.${sign(exp, secret)}`;
  const isHttps =
    req?.headers?.["x-forwarded-proto"] === "https" || process.env.VERCEL === "1";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${
    60 * 60 * 12
  }${isHttps ? "; Secure" : ""}`;
}

export function clearAdminSessionCookie(req) {
  const isHttps =
    req?.headers?.["x-forwarded-proto"] === "https" || process.env.VERCEL === "1";
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${
    isHttps ? "; Secure" : ""
  }`;
}
