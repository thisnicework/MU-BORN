import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  getTicketingConfig,
  fetchPlatformShows,
  createPlatformReservations,
  lookupPlatformReservations,
  TicketingPlatformError,
} from "./ticketing-bridge.mjs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "muborn-db.json");

const COOKIE_NAME = "muborn_admin_session";
const SECRET = process.env.ADMIN_SECRET || "muborn-2026-sia-secret-key-v1";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

function createInitialState() {
  return {
    nextReservationId: 1,
    shows: [
      {
        id: "dinoz",
        title: "창작뮤지컬 <다이노즈>",
        open_at: "2026.11.22.(SUN) 20:00",
        is_open: 1,
        venue: "남산 드라마센터",
      },
      {
        id: "semokkeut",
        title: "창작뮤지컬 <세상 모든 이야기의 끝>",
        open_at: "2026.12.03.(THU) 20:00",
        is_open: 0,
        venue: "서울예술대학교 빨간대문",
      },
    ],
    sessions: [
      {
        id: "dinoz-1",
        show_id: "dinoz",
        round_number: 1,
        label: "1회차",
        date_str: "2026.12.05 (SAT)",
        time_str: "19:00",
        max_capacity: 67,
      },
      {
        id: "dinoz-2",
        show_id: "dinoz",
        round_number: 2,
        label: "2회차",
        date_str: "2026.12.06 (SUN)",
        time_str: "14:00",
        max_capacity: 114,
      },
      {
        id: "dinoz-3",
        show_id: "dinoz",
        round_number: 3,
        label: "3회차",
        date_str: "2026.12.06 (SUN)",
        time_str: "18:00",
        max_capacity: 112,
      },
      {
        id: "semokkeut-1",
        show_id: "semokkeut",
        round_number: 1,
        label: "1회차",
        date_str: "2026.12.19 (SAT)",
        time_str: "19:00",
        max_capacity: 100,
      },
      {
        id: "semokkeut-2",
        show_id: "semokkeut",
        round_number: 2,
        label: "2회차",
        date_str: "2026.12.20 (SUN)",
        time_str: "14:00",
        max_capacity: 100,
      },
      {
        id: "semokkeut-3",
        show_id: "semokkeut",
        round_number: 3,
        label: "3회차",
        date_str: "2026.12.20 (SUN)",
        time_str: "18:00",
        max_capacity: 100,
      },
    ],
    reservations: [],
  };
}

let cachedState = null;

function ensureLoaded() {
  if (cachedState) return cachedState;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      cachedState = JSON.parse(raw);
      return cachedState;
    } catch {
      // Fallback to fresh state if file is corrupted
    }
  }
  cachedState = createInitialState();
  saveState(cachedState);
  return cachedState;
}

function saveState(state) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${DB_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2), "utf-8");
  fs.renameSync(tmpPath, DB_PATH);
}

function nowKstString() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace("T", " ").slice(0, 19);
}

function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return digits;
}

function generateBookingCode(showId) {
  const prefix = showId === "dinoz" ? "DNZ" : "SMK";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 6; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${rand}`;
}

function sign(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const map = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    map[k] = decodeURIComponent(v);
  }
  return map;
}

function isAdminAuthenticated(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return false;
  const expected = sign(ts);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const age = Date.now() - Number(ts);
  return age >= 0 && age < 12 * 60 * 60 * 1000;
}

function verifyPassword(input) {
  const a = Buffer.from(String(input || "").trim());
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function sendJson(res, status, data, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(JSON.stringify(data));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function enrichReservation(state, r) {
  const show = state.shows.find((s) => s.id === r.show_id);
  const sess = state.sessions.find((s) => s.id === r.session_id);
  return {
    ...r,
    show_title: show?.title || "",
    show_venue: show?.venue || "",
    session_label: sess?.label || "",
    date_str: sess?.date_str || "",
    time_str: sess?.time_str || "",
    round_number: sess?.round_number || 0,
  };
}

export async function handleApiRequest(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  const pathname = url.pathname;
  const method = (req.method || "GET").toUpperCase();

  if (!pathname.startsWith("/api/")) return false;

  try {
    const platformCfg = getTicketingConfig();

    // 1. GET /api/shows (public — NEVER exposes max_capacity or remaining seats!)
    if (pathname === "/api/shows" && method === "GET") {
      if (platformCfg.enabled) {
        const result = await fetchPlatformShows();
        sendJson(res, 200, result);
        return true;
      }

      const state = ensureLoaded();
      const publicShows = state.shows.map((show) => ({
        id: show.id,
        title: show.title,
        openAt: show.open_at,
        isOpen: show.is_open === 1,
        venue: show.venue,
        sessions: state.sessions
          .filter((s) => s.show_id === show.id)
          .sort((a, b) => a.round_number - b.round_number)
          .map((s) => {
            const bookedCount = state.reservations.filter(
              (r) => r.session_id === s.id && r.status === "confirmed"
            ).length;
            return {
              id: s.id,
              roundNumber: s.round_number,
              label: s.label,
              dateStr: s.date_str,
              timeStr: s.time_str,
              isSoldOut: bookedCount >= s.max_capacity,
            };
          }),
      }));

      sendJson(res, 200, { shows: publicShows });
      return true;
    }

    // 2. /api/reservations (GET lookup, POST create, DELETE cancel)
    if (pathname === "/api/reservations") {
      if (platformCfg.enabled) {
        try {
          if (method === "GET") {
            const result = await lookupPlatformReservations({
              name: (url.searchParams.get("name") || "").trim(),
              code: (url.searchParams.get("code") || "").trim(),
              phone: (url.searchParams.get("phone") || "").trim(),
            });
            sendJson(res, 200, result);
            return true;
          }
          if (method === "POST") {
            const body = await readJsonBody(req);
            const result = await createPlatformReservations(body);
            sendJson(res, 201, result);
            return true;
          }
          if (method === "DELETE") {
            sendJson(res, 400, {
              error: "온라인 취소는 인스타그램(@sia.bfa.muborn) DM으로 문의해 주세요.",
            });
            return true;
          }
        } catch (err) {
          if (err instanceof TicketingPlatformError) {
            sendJson(res, err.status, {
              error: err.message,
              code: err.code,
              details: err.details,
            });
            return true;
          }
          throw err;
        }
      }

      const state = ensureLoaded();

      if (method === "GET") {
        const name = (url.searchParams.get("name") || "").trim();
        const rawPhone = (url.searchParams.get("phone") || "").trim();
        if (!name || !rawPhone) {
          sendJson(res, 400, { error: "성함과 전화번호를 모두 입력해 주세요." });
          return true;
        }
        const phone = normalizePhone(rawPhone);
        const rows = state.reservations
          .filter((r) => r.name === name && r.phone === phone && r.status === "confirmed")
          .map((r) => enrichReservation(state, r))
          .sort((a, b) => a.round_number - b.round_number);

        sendJson(res, 200, { reservations: rows });
        return true;
      }

      if (method === "POST") {
        const body = await readJsonBody(req);
        const showId = String(body.showId || "").trim();
        const name = String(body.name || "").trim();
        const rawPhone = String(body.phone || "").trim();
        const rawPhoneConfirm = String(body.phoneConfirm || "").trim();
        const sessionIds = Array.isArray(body.sessionIds)
          ? [...new Set(body.sessionIds.map((s) => String(s).trim()))]
          : [];

        if (!showId) {
          sendJson(res, 400, { error: "공연을 선택해 주세요." });
          return true;
        }
        if (name.length < 2 || name.length > 30) {
          sendJson(res, 400, { error: "예매자 성함을 정확히 입력해 주세요. (2~30자)" });
          return true;
        }
        const digits = rawPhone.replace(/\D/g, "");
        const confirmDigits = rawPhoneConfirm.replace(/\D/g, "");
        if (digits.length < 10 || digits.length > 11 || !digits.startsWith("01")) {
          sendJson(res, 400, { error: "올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)" });
          return true;
        }
        if (digits !== confirmDigits) {
          sendJson(res, 400, { error: "입력하신 두 전화번호가 일치하지 않습니다. 다시 확인해 주세요." });
          return true;
        }
        if (sessionIds.length === 0) {
          sendJson(res, 400, { error: "관람하실 회차를 최소 1개 이상 선택해 주세요." });
          return true;
        }

        const phone = normalizePhone(digits);
        const phoneLast4 = digits.slice(-4);

        const show = state.shows.find((s) => s.id === showId);
        if (!show) {
          sendJson(res, 404, { error: "존재하지 않는 공연입니다." });
          return true;
        }
        if (show.is_open !== 1) {
          sendJson(res, 403, { error: `현재 예매 오픈 전입니다. (${show.open_at} 오픈 예정)` });
          return true;
        }

        // Validate all requested sessions synchronously before mutating state
        const validSessions = [];
        for (const sid of sessionIds) {
          const sess = state.sessions.find((s) => s.id === sid && s.show_id === showId);
          if (!sess) {
            sendJson(res, 400, { error: "유효하지 않은 관람 회차가 포함되어 있습니다." });
            return true;
          }
          const existing = state.reservations.find(
            (r) => r.phone === phone && r.session_id === sid && r.status === "confirmed"
          );
          if (existing) {
            sendJson(res, 409, {
              error: `동일한 연락처로 이미 예매된 회차가 있습니다. (${sess.label}: ${sess.date_str} ${sess.time_str}) 회차당 1인 1매까지 예매 가능합니다.`,
            });
            return true;
          }
          const bookedCount = state.reservations.filter(
            (r) => r.session_id === sid && r.status === "confirmed"
          ).length;
          if (bookedCount >= sess.max_capacity) {
            sendJson(res, 409, {
              error: `선택하신 회차가 매진되었습니다. (${sess.label}: ${sess.date_str} ${sess.time_str})`,
            });
            return true;
          }
          validSessions.push(sess);
        }

        const tickets = [];
        const createdAt = nowKstString();
        for (const sess of validSessions) {
          const code = generateBookingCode(showId);
          const id = state.nextReservationId++;
          state.reservations.push({
            id,
            booking_code: code,
            show_id: showId,
            session_id: sess.id,
            name,
            phone,
            phone_last4: phoneLast4,
            checked_in: 0,
            checked_in_at: null,
            status: "confirmed",
            created_at: createdAt,
          });
          tickets.push({
            bookingCode: code,
            showTitle: show.title,
            venue: show.venue,
            sessionLabel: sess.label,
            dateStr: sess.date_str,
            timeStr: sess.time_str,
            name,
            phoneLast4,
          });
        }

        saveState(state);
        sendJson(res, 201, { ok: true, tickets });
        return true;
      }

      if (method === "DELETE") {
        const body = await readJsonBody(req);
        const bookingCode = String(body.bookingCode || "").trim();
        const rawPhone = String(body.phone || "").trim();
        if (!bookingCode || !rawPhone) {
          sendJson(res, 400, { error: "예매번호와 전화번호를 입력해 주세요." });
          return true;
        }
        const phone = normalizePhone(rawPhone);
        const target = state.reservations.find(
          (r) => r.booking_code === bookingCode && r.phone === phone && r.status === "confirmed"
        );
        if (!target) {
          sendJson(res, 404, { error: "일치하는 유효 예매 내역을 찾을 수 없습니다." });
          return true;
        }
        target.status = "cancelled";
        saveState(state);
        sendJson(res, 200, { ok: true });
        return true;
      }
    }

    // 3. /api/admin/auth
    if (pathname === "/api/admin/auth") {
      if (method === "GET") {
        sendJson(res, 200, { authenticated: isAdminAuthenticated(req) });
        return true;
      }
      if (method === "POST") {
        const body = await readJsonBody(req);
        if (!verifyPassword(body.password)) {
          sendJson(res, 401, { error: "비밀번호가 올바르지 않습니다." });
          return true;
        }
        const ts = String(Date.now());
        const token = `${ts}.${sign(ts)}`;
        const cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 12}`;
        sendJson(res, 200, { ok: true }, { "Set-Cookie": cookie });
        return true;
      }
      if (method === "DELETE") {
        const cookie = `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
        sendJson(res, 200, { ok: true }, { "Set-Cookie": cookie });
        return true;
      }
    }

    // 4. /api/admin/dashboard
    if (pathname === "/api/admin/dashboard") {
      if (!isAdminAuthenticated(req)) {
        sendJson(res, 401, { error: "Unauthorized" });
        return true;
      }
      const state = ensureLoaded();

      if (method === "GET") {
        const sessions = state.sessions
          .slice()
          .sort((a, b) => a.show_id.localeCompare(b.show_id) || a.round_number - b.round_number)
          .map((s) => {
            const confirmed = state.reservations.filter(
              (r) => r.session_id === s.id && r.status === "confirmed"
            );
            return {
              ...s,
              booked_count: confirmed.length,
              checked_in_count: confirmed.filter((r) => r.checked_in === 1).length,
            };
          });

        const reservations = state.reservations
          .slice()
          .sort((a, b) => b.id - a.id)
          .map((r) => enrichReservation(state, r));

        sendJson(res, 200, { shows: state.shows, sessions, reservations });
        return true;
      }

      if (method === "PATCH") {
        const body = await readJsonBody(req);
        const action = String(body.action || "");

        if (action === "toggle_show") {
          const show = state.shows.find((s) => s.id === String(body.showId || ""));
          if (show) {
            show.is_open = body.isOpen ? 1 : 0;
            saveState(state);
          }
          sendJson(res, 200, { ok: true });
          return true;
        }
        if (action === "update_capacity") {
          const cap = Math.max(0, Math.min(5000, Number(body.maxCapacity)));
          if (!Number.isFinite(cap)) {
            sendJson(res, 400, { error: "잘못된 수량입니다." });
            return true;
          }
          const sess = state.sessions.find((s) => s.id === String(body.sessionId || ""));
          if (sess) {
            sess.max_capacity = cap;
            saveState(state);
          }
          sendJson(res, 200, { ok: true });
          return true;
        }
        if (action === "toggle_checkin") {
          const resRow = state.reservations.find((r) => r.id === Number(body.id));
          if (resRow) {
            resRow.checked_in = body.checkedIn ? 1 : 0;
            resRow.checked_in_at = body.checkedIn ? nowKstString() : null;
            saveState(state);
          }
          sendJson(res, 200, { ok: true });
          return true;
        }
        if (action === "set_status") {
          const resRow = state.reservations.find((r) => r.id === Number(body.id));
          if (resRow) {
            resRow.status = body.status === "cancelled" ? "cancelled" : "confirmed";
            saveState(state);
          }
          sendJson(res, 200, { ok: true });
          return true;
        }

        sendJson(res, 400, { error: "Unknown action" });
        return true;
      }
    }

    // 5. /api/admin/export
    if (pathname === "/api/admin/export" && method === "GET") {
      if (!isAdminAuthenticated(req)) {
        sendJson(res, 401, { error: "Unauthorized" });
        return true;
      }
      const state = ensureLoaded();
      const showId = url.searchParams.get("showId") || "";
      const sessionId = url.searchParams.get("sessionId") || "";

      const rows = state.reservations
        .filter((r) => (!showId || r.show_id === showId) && (!sessionId || r.session_id === sessionId))
        .map((r) => enrichReservation(state, r))
        .sort((a, b) => a.round_number - b.round_number || a.name.localeCompare(b.name, "ko"));

      const header = [
        "예매번호",
        "공연명",
        "회차",
        "공연일",
        "공연시간",
        "예매자 성함",
        "전화번호",
        "뒷자리",
        "상태",
        "티켓수령",
        "수령시각",
        "예매시각",
      ];
      const lines = [
        header.map(csvEscape).join(","),
        ...rows.map((r) =>
          [
            r.booking_code,
            r.show_title,
            r.session_label,
            r.date_str,
            r.time_str,
            r.name,
            r.phone,
            r.phone_last4,
            r.status === "confirmed" ? "예매확정" : "취소",
            r.checked_in ? "수령완료" : "미수령",
            r.checked_in_at || "",
            r.created_at,
          ]
            .map(csvEscape)
            .join(",")
        ),
      ];
      const csv = "\uFEFF" + lines.join("\r\n");
      res.writeHead(200, {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="muborn-2026-reservations.csv"',
      });
      res.end(csv);
      return true;
    }

    sendJson(res, 404, { error: "API route not found" });
    return true;
  } catch (err) {
    console.error("API error:", err);
    sendJson(res, 500, { error: "서버 처리 중 오류가 발생했습니다." });
    return true;
  }
}
