import { isAdminAuthenticated } from "../../server/admin-auth.mjs";
import {
  exportPlatformAdminCsv,
  TicketingPlatformError,
} from "../../server/ticketing-bridge.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ error: "관리자 인증이 필요합니다." });
    return;
  }

  try {
    const query = req.query || {};
    const showId = String(Array.isArray(query.showId) ? query.showId[0] : query.showId || "").trim();
    const sessionId = String(
      Array.isArray(query.sessionId) ? query.sessionId[0] : query.sessionId || ""
    ).trim();

    const csv = await exportPlatformAdminCsv({ showId, sessionId });
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="muborn-2026-reservations.csv"'
    );
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(`\uFEFF${csv}`);
  } catch (err) {
    if (err instanceof TicketingPlatformError) {
      res.status(err.status).json({ error: err.message, code: err.code });
      return;
    }
    res.status(500).json({ error: "CSV 내보내기 중 오류가 발생했습니다." });
  }
}
