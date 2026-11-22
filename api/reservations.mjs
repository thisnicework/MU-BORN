import {
  createPlatformReservations,
  lookupPlatformReservations,
  TicketingPlatformError,
} from "../server/ticketing-bridge.mjs";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      const query = req.query || {};
      const result = await lookupPlatformReservations({
        name: Array.isArray(query.name) ? query.name[0] : query.name,
        code: Array.isArray(query.code) ? query.code[0] : query.code,
        phone: Array.isArray(query.phone) ? query.phone[0] : query.phone,
      });
      res.status(200).json(result);
      return;
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const result = await createPlatformReservations(body);
      res.status(201).json(result);
      return;
    }

    if (req.method === "DELETE") {
      res.status(400).json({
        error: "온라인 취소는 인스타그램(@sia.bfa.muborn) DM으로 문의해 주세요.",
      });
      return;
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    if (err instanceof TicketingPlatformError) {
      res.status(err.status).json({
        error: err.message,
        code: err.code,
        details: err.details,
      });
      return;
    }
    res.status(500).json({ error: "예매 처리 중 오류가 발생했습니다." });
  }
}
