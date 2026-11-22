import { fetchPlatformShows, TicketingPlatformError } from "../server/ticketing-bridge.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    res.setHeader("Cache-Control", "no-store");
    const result = await fetchPlatformShows();
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof TicketingPlatformError) {
      res.status(err.status).json({ error: err.message, code: err.code });
      return;
    }
    res.status(500).json({ error: "공연 정보를 불러오지 못했습니다." });
  }
}
