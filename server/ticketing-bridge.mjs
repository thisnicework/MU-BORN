import fs from "node:fs";
import path from "node:path";

/**
 * Load .env and .env.local into process.env when running locally (non-destructive).
 */
let envLoaded = false;
export function loadLocalEnv() {
  if (envLoaded) return;
  envLoaded = true;
  for (const fname of [".env.local", ".env"]) {
    const full = path.join(process.cwd(), fname);
    if (!fs.existsSync(full)) continue;
    try {
      const lines = fs.readFileSync(full, "utf-8").split(/\r?\n/);
      for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (key && process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    } catch {
      // ignore read errors
    }
  }
}

export const SHOW_CATALOG = [
  {
    id: "dinoz",
    envKey: "DINOZ_EVENT_ID",
    defaultEventId: "20f3f2c4-8e4f-48d3-9ebf-e1e9f8f4e2e2",
    fallbackTitle: "창작뮤지컬 <다이노즈>",
    fallbackVenue: "남산 드라마센터",
    fallbackOpenAt: "2026.11.22.(SUN) 20:00",
  },
  {
    id: "semokkeut",
    envKey: "SEMOKKEUT_EVENT_ID",
    defaultEventId: "dab43ba3-3eb9-4934-ba30-dc0e9952cc6b",
    fallbackTitle: "창작뮤지컬 <세상 모든 이야기의 끝>",
    fallbackVenue: "서울예술대학교 빨간대문",
    fallbackOpenAt: "2026.12.03.(THU) 20:00",
  },
];

const DEFAULT_TICKETING_BASE_URL = "https://hyunjun-ticket-server.vercel.app";

export function getTicketingConfig() {
  loadLocalEnv();
  const baseUrl = (process.env.TICKETING_BASE_URL || DEFAULT_TICKETING_BASE_URL)
    .trim()
    .replace(/\/+$/, "");
  const apiKey = (process.env.TICKETING_API_KEY || "").trim();
  const events = {
    dinoz: (process.env.DINOZ_EVENT_ID || SHOW_CATALOG[0].defaultEventId).trim(),
    semokkeut: (process.env.SEMOKKEUT_EVENT_ID || SHOW_CATALOG[1].defaultEventId).trim(),
  };
  return {
    enabled: Boolean(baseUrl && apiKey),
    baseUrl,
    apiKey,
    events,
  };
}

export class TicketingPlatformError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "TicketingPlatformError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function createPlatformClient() {
  const cfg = getTicketingConfig();
  if (!cfg.enabled) {
    throw new TicketingPlatformError(
      503,
      "TICKETING_NOT_CONFIGURED",
      "예매 API 서버(TICKETING_BASE_URL, TICKETING_API_KEY)가 아직 설정되지 않았습니다."
    );
  }

  async function request(reqPath, init) {
    const res = await fetch(`${cfg.baseUrl}${reqPath}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": cfg.apiKey,
        ...(init?.headers || {}),
      },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = data?.error;
      throw new TicketingPlatformError(
        res.status,
        err?.code || "REQUEST_FAILED",
        err?.message || `HTTP ${res.status}`,
        err?.details
      );
    }
    return data;
  }

  return {
    events: {
      list: () => request("/v1/events"),
      get: (eventId) => request(`/v1/events/${encodeURIComponent(eventId)}`),
    },
    reservations: {
      create: (params) =>
        request("/v1/reservations", {
          method: "POST",
          body: JSON.stringify(params),
        }),
      lookup: (params) =>
        request("/v1/reservations/lookup", {
          method: "POST",
          body: JSON.stringify(params),
        }),
    },
  };
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function formatKstDateTime(isoString) {
  if (!isoString) {
    return { dateStr: "", timeStr: "", openLabel: "" };
  }
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) {
    return { dateStr: isoString, timeStr: "", openLabel: isoString };
  }
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(kst.getUTCDate()).padStart(2, "0");
  const wd = WEEKDAYS[kst.getUTCDay()];
  const hh = String(kst.getUTCHours()).padStart(2, "0");
  const mi = String(kst.getUTCMinutes()).padStart(2, "0");
  return {
    dateStr: `${yyyy}.${mm}.${dd} (${wd})`,
    timeStr: `${hh}:${mi}`,
    openLabel: `${yyyy}.${mm}.${dd}.(${wd}) ${hh}:${mi}`,
  };
}

export function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return digits;
}

/**
 * Fetch public shows from external Ticketing Platform API.
 * Strictly strips totalQuantity and remainingQuantity before returning to public clients.
 */
export async function fetchPlatformShows() {
  const cfg = getTicketingConfig();
  const client = createPlatformClient();
  const now = Date.now();

  const shows = await Promise.all(
    SHOW_CATALOG.map(async (meta) => {
      const eventId = cfg.events[meta.id];
      try {
        const detail = await client.events.get(eventId);
        const sortedSchedules = [...(detail.schedules || [])].sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );

        let earliestOpenMs = null;

        const sessions = sortedSchedules.map((sc, idx) => {
          const { dateStr, timeStr } = formatKstDateTime(sc.startsAt);
          const openMs = sc.salesOpenAt ? new Date(sc.salesOpenAt).getTime() : null;
          const closeMs = sc.salesCloseAt ? new Date(sc.salesCloseAt).getTime() : null;

          if (openMs !== null && !Number.isNaN(openMs)) {
            if (earliestOpenMs === null || openMs < earliestOpenMs) {
              earliestOpenMs = openMs;
            }
          }

          let salesStatus = "open";
          if (openMs !== null && !Number.isNaN(openMs) && now < openMs) {
            salesStatus = "upcoming";
          } else if (closeMs !== null && !Number.isNaN(closeMs) && now > closeMs) {
            salesStatus = "closed";
          }

          const types = Array.isArray(sc.ticketTypes) ? sc.ticketTypes : [];
          const primaryType =
            types.find((t) => Number(t.remainingQuantity) > 0) || types[0] || null;
          const totalRemaining = types.reduce(
            (sum, t) => sum + Math.max(0, Number(t.remainingQuantity || 0)),
            0
          );

          return {
            id: sc.id,
            roundNumber: idx + 1,
            label: `${idx + 1}회차`,
            dateStr,
            timeStr,
            ticketTypeId: primaryType?.id || null,
            ticketTypeName: primaryType?.name || "일반 관람권",
            price: primaryType?.price ?? 0,
            isSoldOut: types.length === 0 || totalRemaining <= 0,
            salesStatus,
            salesOpenAt: sc.salesOpenAt,
            salesCloseAt: sc.salesCloseAt,
          };
        });

        const hasOpenSession = sessions.some((s) => s.salesStatus === "open");
        const openAtLabel =
          earliestOpenMs !== null
            ? formatKstDateTime(new Date(earliestOpenMs).toISOString()).openLabel
            : meta.fallbackOpenAt;

        return {
          id: meta.id,
          eventId,
          title: detail.title || meta.fallbackTitle,
          openAt: openAtLabel,
          isOpen: sessions.length > 0 && hasOpenSession,
          pendingSchedules: sessions.length === 0,
          venue: detail.venue && detail.venue !== "-" ? detail.venue : meta.fallbackVenue,
          source: "platform",
          sessions,
        };
      } catch (err) {
        return {
          id: meta.id,
          eventId,
          title: meta.fallbackTitle,
          openAt: meta.fallbackOpenAt,
          isOpen: false,
          pendingSchedules: true,
          venue: meta.fallbackVenue,
          source: "platform",
          loadError: err instanceof Error ? err.message : "공연 정보를 불러오지 못했습니다.",
          sessions: [],
        };
      }
    })
  );

  return { shows, source: "platform" };
}

/**
 * Create reservations for 1..N selected schedules (1 ticket per schedule) via Ticketing Platform API.
 */
export async function createPlatformReservations(body) {
  const showId = String(body.showId || "").trim();
  const name = String(body.name || "").trim();
  const rawPhone = String(body.phone || "").trim();
  const rawPhoneConfirm = String(body.phoneConfirm || "").trim();
  const sessionIds = Array.isArray(body.sessionIds)
    ? [...new Set(body.sessionIds.map((s) => String(s).trim()).filter(Boolean))]
    : [];
  const ticketTypeMap =
    body.ticketTypeMap && typeof body.ticketTypeMap === "object" ? body.ticketTypeMap : {};

  if (!showId) {
    throw new TicketingPlatformError(400, "INVALID_SHOW", "공연을 선택해 주세요.");
  }
  if (name.length < 2 || name.length > 30) {
    throw new TicketingPlatformError(
      400,
      "INVALID_NAME",
      "예매자 성함을 정확히 입력해 주세요. (2~30자)"
    );
  }
  const digits = rawPhone.replace(/\D/g, "");
  const confirmDigits = rawPhoneConfirm.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11 || !digits.startsWith("01")) {
    throw new TicketingPlatformError(
      400,
      "INVALID_PHONE",
      "올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)"
    );
  }
  if (digits !== confirmDigits) {
    throw new TicketingPlatformError(
      400,
      "PHONE_MISMATCH",
      "입력하신 두 전화번호가 일치하지 않습니다. 다시 확인해 주세요."
    );
  }
  if (sessionIds.length === 0) {
    throw new TicketingPlatformError(
      400,
      "NO_SESSIONS",
      "관람하실 회차를 최소 1개 이상 선택해 주세요."
    );
  }

  const cfg = getTicketingConfig();
  const eventId = cfg.events[showId];
  const showMeta = SHOW_CATALOG.find((s) => s.id === showId);
  if (!eventId || !showMeta) {
    throw new TicketingPlatformError(404, "SHOW_NOT_FOUND", "존재하지 않는 공연입니다.");
  }

  const client = createPlatformClient();
  const detail = await client.events.get(eventId);
  const sortedSchedules = [...(detail.schedules || [])].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  const scheduleMetaById = new Map(
    sortedSchedules.map((sc, idx) => {
      const { dateStr, timeStr } = formatKstDateTime(sc.startsAt);
      const types = Array.isArray(sc.ticketTypes) ? sc.ticketTypes : [];
      const defaultType = types.find((t) => Number(t.remainingQuantity) > 0) || types[0] || null;
      return [
        sc.id,
        {
          schedule: sc,
          label: `${idx + 1}회차`,
          dateStr,
          timeStr,
          defaultTicketTypeId: defaultType?.id || null,
        },
      ];
    })
  );

  const normalizedPhone = normalizePhone(digits);
  const phoneLast4 = digits.slice(-4);
  const createdTickets = [];

  for (const scheduleId of sessionIds) {
    const sMeta = scheduleMetaById.get(scheduleId);
    if (!sMeta) {
      throw new TicketingPlatformError(400, "INVALID_SCHEDULE", "유효하지 않은 회차입니다.");
    }
    const ticketTypeId = String(ticketTypeMap[scheduleId] || sMeta.defaultTicketTypeId || "").trim();
    if (!ticketTypeId) {
      throw new TicketingPlatformError(
        409,
        "NO_TICKET_TYPE",
        `${sMeta.label}에 예매 가능한 티켓 권종이 없습니다.`
      );
    }

    const result = await client.reservations.create({
      scheduleId,
      customerName: name,
      customerPhone: normalizedPhone,
      items: [{ ticketTypeId, quantity: 1 }],
      metadata: {
        source: "muborn-2026-web",
        showId,
      },
    });

    const formatted = formatKstDateTime(result.schedule?.startsAt || sMeta.schedule.startsAt);
    createdTickets.push({
      bookingCode: result.reservationCode,
      showTitle: result.event?.title || detail.title || showMeta.fallbackTitle,
      venue:
        result.event?.venue && result.event.venue !== "-"
          ? result.event.venue
          : detail.venue && detail.venue !== "-"
            ? detail.venue
            : showMeta.fallbackVenue,
      sessionLabel: sMeta.label,
      dateStr: formatted.dateStr || sMeta.dateStr,
      timeStr: formatted.timeStr || sMeta.timeStr,
      name: result.customerName || name,
      phoneLast4,
    });
  }

  return { tickets: createdTickets, source: "platform" };
}

/**
 * Lookup reservations via Ticketing Platform API using (name + phone) OR (code + phone).
 */
export async function lookupPlatformReservations({ name, code, phone }) {
  const cleanPhone = String(phone || "").trim();
  const digits = cleanPhone.replace(/\D/g, "");
  if (digits.length < 10) {
    throw new TicketingPlatformError(400, "INVALID_PHONE", "전화번호를 정확히 입력해 주세요.");
  }

  const cleanName = String(name || "").trim();
  const cleanCode = String(code || "").trim();
  if (!cleanName && !cleanCode) {
    throw new TicketingPlatformError(
      400,
      "MISSING_QUERY",
      "예매자 성함 또는 예매번호를 입력해 주세요."
    );
  }

  const client = createPlatformClient();
  const normalizedPhone = normalizePhone(digits);

  const payload = cleanCode
    ? { customerPhone: normalizedPhone, reservationCode: cleanCode }
    : { customerPhone: normalizedPhone, customerName: cleanName };

  let data;
  try {
    data = await client.reservations.lookup(payload);
  } catch (err) {
    // Retry with raw digits if platform stored unformatted phone numbers
    if (err instanceof TicketingPlatformError && err.status === 404 && normalizedPhone !== digits) {
      const altPayload = cleanCode
        ? { customerPhone: digits, reservationCode: cleanCode }
        : { customerPhone: digits, customerName: cleanName };
      data = await client.reservations.lookup(altPayload);
    } else {
      throw err;
    }
  }

  const reservations = (data?.reservations || []).map((r, idx) => {
    const { dateStr, timeStr } = formatKstDateTime(r.schedule?.startsAt);
    const showMeta = SHOW_CATALOG.find(
      (s) => s.defaultEventId === r.event?.id || process.env[s.envKey] === r.event?.id
    );
    const venue =
      r.event?.venue && r.event.venue !== "-"
        ? r.event.venue
        : showMeta?.fallbackVenue || "공연장 추후 공지";
    const phoneDigitsOnly = String(r.customerPhone || digits).replace(/\D/g, "");
    const itemSummary =
      Array.isArray(r.items) && r.items.length > 0
        ? r.items.map((it) => `${it.ticketTypeName} ${it.quantity}매`).join(", ")
        : `${r.totalQuantity || 1}매`;

    return {
      id: r.id || idx + 1,
      booking_code: r.reservationCode,
      show_id: showMeta?.id || r.event?.id || "",
      show_title: r.event?.title || showMeta?.fallbackTitle || "MU:BORN 2026",
      show_venue: venue,
      session_label: itemSummary,
      date_str: dateStr,
      time_str: timeStr,
      name: r.customerName,
      phone_last4: phoneDigitsOnly.slice(-4),
      checked_in: 0,
      created_at: r.createdAt || "",
      can_cancel: false,
    };
  });

  return { reservations, source: "platform" };
}
