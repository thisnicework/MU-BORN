import { isAdminAuthenticated } from "../../server/admin-auth.mjs";
import {
  fetchPlatformAdminDashboard,
  patchPlatformAdmin,
  TicketingPlatformError,
} from "../../server/ticketing-bridge.mjs";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ error: "관리자 인증이 필요합니다." });
    return;
  }

  try {
    if (req.method === "GET") {
      const data = await fetchPlatformAdminDashboard();
      res.status(200).json(data);
      return;
    }

    if (req.method === "PATCH") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const result = await patchPlatformAdmin(body);
      res.status(200).json(result);
      return;
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    if (err instanceof TicketingPlatformError) {
      res.status(err.status).json({ error: err.message, code: err.code });
      return;
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : "관리자 요청 처리 중 오류가 발생했습니다.",
    });
  }
}
