import {
  isAdminAuthenticated,
  verifyAdminPassword,
  createAdminSessionCookie,
  clearAdminSessionCookie,
} from "../../server/admin-auth.mjs";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    res.status(200).json({ authenticated: isAdminAuthenticated(req) });
    return;
  }

  if (req.method === "POST") {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (!verifyAdminPassword(body.password)) {
      res.status(401).json({ error: "관리자 비밀번호가 올바르지 않습니다." });
      return;
    }
    res.setHeader("Set-Cookie", createAdminSessionCookie(req));
    res.status(200).json({ authenticated: true });
    return;
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearAdminSessionCookie(req));
    res.status(200).json({ authenticated: false });
    return;
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
