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
  const adminKey = (process.env.TICKETING_ADMIN_KEY || "").trim();
  const events = {
    dinoz: (process.env.DINOZ_EVENT_ID || SHOW_CATALOG[0].defaultEventId).trim(),
    semokkeut: (process.env.SEMOKKEUT_EVENT_ID || SHOW_CATALOG[1].defaultEventId).trim(),
  };
  return {
    enabled: Boolean(baseUrl && apiKey),
    adminEnabled: Boolean(baseUrl && adminKey),
    baseUrl,
    apiKey,
    adminKey,
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

  // Validate all selected schedules exist first
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
  }

  // Prevent duplicate reservation by the same phone number on the same schedule/time
  if (cfg.adminEnabled) {
    try {
      const adminClient = createPlatformAdminClient();
      const existingReservations = await fetchAllPlatformReservations(adminClient);
      for (const scheduleId of sessionIds) {
        const sMeta = scheduleMetaById.get(scheduleId);
        const targetStartsAtMs = sMeta?.schedule?.startsAt
          ? new Date(sMeta.schedule.startsAt).getTime()
          : null;

        const duplicate = existingReservations.find((r) => {
          const rDigits = String(r.customerPhone || "").replace(/\D/g, "");
          if (rDigits !== digits) return false;
          if (r.scheduleId === scheduleId) return true;
          if (targetStartsAtMs !== null && r.scheduleStartsAt) {
            return new Date(r.scheduleStartsAt).getTime() === targetStartsAtMs;
          }
          return false;
        });

        if (duplicate) {
          throw new TicketingPlatformError(
            409,
            "DUPLICATE_RESERVATION",
            `입력하신 전화번호로 이미 해당 회차(${sMeta.label} · ${sMeta.dateStr} ${sMeta.timeStr})에 예매된 내역이 있습니다. (회차당 1인 1매 제한)`
          );
        }
      }
    } catch (err) {
      if (err instanceof TicketingPlatformError && err.code === "DUPLICATE_RESERVATION") {
        throw err;
      }
      // Fallback to public lookup by name + phone if admin list fails
      try {
        const lookedUp = await client.reservations.lookup({
          customerPhone: normalizedPhone,
          customerName: name,
        });
        const list = Array.isArray(lookedUp?.reservations) ? lookedUp.reservations : [];
        for (const scheduleId of sessionIds) {
          const sMeta = scheduleMetaById.get(scheduleId);
          const targetStartsAtMs = sMeta?.schedule?.startsAt
            ? new Date(sMeta.schedule.startsAt).getTime()
            : null;
          const dup = list.find(
            (r) =>
              r.schedule?.id === scheduleId ||
              (targetStartsAtMs !== null &&
                r.schedule?.startsAt &&
                new Date(r.schedule.startsAt).getTime() === targetStartsAtMs)
          );
          if (dup) {
            throw new TicketingPlatformError(
              409,
              "DUPLICATE_RESERVATION",
              `입력하신 전화번호로 이미 해당 회차(${sMeta.label} · ${sMeta.dateStr} ${sMeta.timeStr})에 예매된 내역이 있습니다. (회차당 1인 1매 제한)`
            );
          }
        }
      } catch (lookupErr) {
        if (
          lookupErr instanceof TicketingPlatformError &&
          lookupErr.code === "DUPLICATE_RESERVATION"
        ) {
          throw lookupErr;
        }
      }
    }
  } else {
    // Public lookup check when admin key is not present
    try {
      const lookedUp = await client.reservations.lookup({
        customerPhone: normalizedPhone,
        customerName: name,
      });
      const list = Array.isArray(lookedUp?.reservations) ? lookedUp.reservations : [];
      for (const scheduleId of sessionIds) {
        const sMeta = scheduleMetaById.get(scheduleId);
        const targetStartsAtMs = sMeta?.schedule?.startsAt
          ? new Date(sMeta.schedule.startsAt).getTime()
          : null;
        const dup = list.find(
          (r) =>
            r.schedule?.id === scheduleId ||
            (targetStartsAtMs !== null &&
              r.schedule?.startsAt &&
              new Date(r.schedule.startsAt).getTime() === targetStartsAtMs)
        );
        if (dup) {
          throw new TicketingPlatformError(
            409,
            "DUPLICATE_RESERVATION",
            `입력하신 전화번호로 이미 해당 회차(${sMeta.label} · ${sMeta.dateStr} ${sMeta.timeStr})에 예매된 내역이 있습니다. (회차당 1인 1매 제한)`
          );
        }
      }
    } catch (lookupErr) {
      if (
        lookupErr instanceof TicketingPlatformError &&
        lookupErr.code === "DUPLICATE_RESERVATION"
      ) {
        throw lookupErr;
      }
    }
  }

  const createdTickets = [];

  for (const scheduleId of sessionIds) {
    const sMeta = scheduleMetaById.get(scheduleId);
    const ticketTypeId = String(ticketTypeMap[scheduleId] || sMeta.defaultTicketTypeId || "").trim();

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

/**
 * Create an authenticated admin client for /v1/admin/* endpoints using TICKETING_ADMIN_KEY (sk_live_...).
 */
function createPlatformAdminClient() {
  const cfg = getTicketingConfig();
  if (!cfg.adminEnabled) {
    throw new TicketingPlatformError(
      503,
      "ADMIN_KEY_MISSING",
      "티켓 서버의 관리자 API Key(TICKETING_ADMIN_KEY: sk_live_...)가 아직 설정되지 않았습니다."
    );
  }

  async function request(reqPath, init) {
    const res = await fetch(`${cfg.baseUrl}${reqPath}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.adminKey}`,
        ...(init?.headers || {}),
      },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = data?.error;
      throw new TicketingPlatformError(
        res.status,
        err?.code || "ADMIN_REQUEST_FAILED",
        err?.message || `HTTP ${res.status}`,
        err?.details
      );
    }
    return data;
  }

  return {
    listReservations: (limit = 200, offset = 0) =>
      request(`/v1/admin/reservations?limit=${limit}&offset=${offset}`),
    updateSchedule: (scheduleId, payload) =>
      request(`/v1/admin/schedules/${encodeURIComponent(scheduleId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    updateTicketType: (ticketTypeId, payload) =>
      request(`/v1/admin/ticket-types/${encodeURIComponent(ticketTypeId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    cancelReservation: (reservationId) =>
      request(`/v1/admin/reservations/${encodeURIComponent(reservationId)}`, {
        method: "DELETE",
      }),
  };
}

async function fetchAllPlatformReservations(adminClient) {
  const all = [];
  let offset = 0;
  const limit = 200;
  for (let page = 0; page < 10; page++) {
    const res = await adminClient.listReservations(limit, offset);
    const batch = Array.isArray(res?.reservations) ? res.reservations : [];
    all.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }
  return all;
}

/**
 * Admin Dashboard live data (shows, sessions with max/booked/remaining, and reservations).
 */
export async function fetchPlatformAdminDashboard() {
  const cfg = getTicketingConfig();
  const publicClient = createPlatformClient();
  const now = Date.now();

  const shows = [];
  const sessions = [];
  const scheduleLookup = new Map();

  for (const meta of SHOW_CATALOG) {
    const eventId = cfg.events[meta.id];
    let detail = null;
    try {
      detail = await publicClient.events.get(eventId);
    } catch {
      detail = null;
    }

    const sortedSchedules = [...(detail?.schedules || [])].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );

    let earliestOpenMs = null;
    let hasOpenSession = false;

    sortedSchedules.forEach((sc, idx) => {
      const { dateStr, timeStr } = formatKstDateTime(sc.startsAt);
      const openMs = sc.salesOpenAt ? new Date(sc.salesOpenAt).getTime() : null;
      const closeMs = sc.salesCloseAt ? new Date(sc.salesCloseAt).getTime() : null;
      if (openMs !== null && !Number.isNaN(openMs)) {
        if (earliestOpenMs === null || openMs < earliestOpenMs) {
          earliestOpenMs = openMs;
        }
      }
      const openNow =
        (openMs === null || Number.isNaN(openMs) || now >= openMs) &&
        (closeMs === null || Number.isNaN(closeMs) || now <= closeMs);
      if (openNow) hasOpenSession = true;

      const types = Array.isArray(sc.ticketTypes) ? sc.ticketTypes : [];
      const primary = types[0] || null;
      const maxCap = types.reduce((sum, t) => sum + Number(t.totalQuantity || 0), 0);
      const remaining = types.reduce(
        (sum, t) => sum + Math.max(0, Number(t.remainingQuantity || 0)),
        0
      );
      const booked = Math.max(0, maxCap - remaining);

      const sessionObj = {
        id: sc.id,
        show_id: meta.id,
        round_number: idx + 1,
        label: `${idx + 1}회차`,
        date_str: dateStr,
        time_str: timeStr,
        max_capacity: maxCap,
        booked_count: booked,
        checked_in_count: 0,
        ticket_type_id: primary?.id || null,
        sales_open_at: sc.salesOpenAt,
        sales_close_at: sc.salesCloseAt,
        is_open_now: openNow,
      };
      sessions.push(sessionObj);
      scheduleLookup.set(sc.id, sessionObj);
    });

    const openAtLabel =
      earliestOpenMs !== null
        ? formatKstDateTime(new Date(earliestOpenMs).toISOString()).openLabel
        : meta.fallbackOpenAt;

    shows.push({
      id: meta.id,
      event_id: eventId,
      title: detail?.title || meta.fallbackTitle,
      open_at: openAtLabel,
      is_open: sortedSchedules.length > 0 && hasOpenSession ? 1 : 0,
      venue: detail?.venue && detail.venue !== "-" ? detail.venue : meta.fallbackVenue,
    });
  }

  let reservations = [];
  let adminKeyMissing = !cfg.adminEnabled;
  let adminError = null;

  if (cfg.adminEnabled) {
    try {
      const adminClient = createPlatformAdminClient();
      const rawList = await fetchAllPlatformReservations(adminClient);
      reservations = rawList.map((r) => {
        const sMeta = scheduleLookup.get(r.scheduleId);
        const { dateStr, timeStr } = formatKstDateTime(r.scheduleStartsAt);
        const phoneDigits = String(r.customerPhone || "").replace(/\D/g, "");
        return {
          id: r.id,
          booking_code: r.reservationCode,
          show_id: sMeta?.show_id || (r.eventTitle?.includes("다이노즈") ? "dinoz" : "semokkeut"),
          show_title: r.eventTitle || "MU:BORN 2026",
          session_id: r.scheduleId,
          session_label: sMeta?.label || "회차",
          date_str: sMeta?.date_str || dateStr,
          time_str: sMeta?.time_str || timeStr,
          round_number: sMeta?.round_number || 0,
          name: r.customerName,
          phone: normalizePhone(phoneDigits || r.customerPhone),
          phone_last4: phoneDigits.slice(-4),
          checked_in: 0,
          checked_in_at: null,
          status: "confirmed",
          created_at: r.createdAt || "",
        };
      });
    } catch (err) {
      adminError = err instanceof Error ? err.message : "예매자 명단을 불러오지 못했습니다.";
    }
  }

  return {
    shows,
    sessions,
    reservations,
    source: "platform",
    adminKeyMissing,
    adminError,
  };
}

/**
 * Admin PATCH actions proxied to ticket-server /v1/admin/*.
 */
export async function patchPlatformAdmin(body) {
  const action = String(body.action || "");
  const adminClient = createPlatformAdminClient();

  if (action === "toggle_show") {
    const showId = String(body.showId || "");
    const isOpen = Boolean(body.isOpen);
    const cfg = getTicketingConfig();
    const eventId = cfg.events[showId];
    if (!eventId) {
      throw new TicketingPlatformError(404, "SHOW_NOT_FOUND", "공연을 찾을 수 없습니다.");
    }
    const publicClient = createPlatformClient();
    const detail = await publicClient.events.get(eventId);
    const schedulesList = detail?.schedules || [];
    if (schedulesList.length === 0) {
      throw new TicketingPlatformError(
        400,
        "NO_SCHEDULES",
        "등록된 회차가 없어 오픈 상태를 변경할 수 없습니다. 티켓 서버에서 회차를 먼저 추가해 주세요."
      );
    }

    const patchPayload = isOpen
      ? { salesOpenAt: null, salesCloseAt: null, isActive: true }
      : { salesCloseAt: new Date(Date.now() - 1000).toISOString() };

    await Promise.all(
      schedulesList.map((sc) => adminClient.updateSchedule(sc.id, patchPayload))
    );
    return { ok: true };
  }

  if (action === "update_capacity") {
    const cap = Math.max(0, Math.min(5000, Math.floor(Number(body.maxCapacity))));
    if (!Number.isFinite(cap)) {
      throw new TicketingPlatformError(400, "INVALID_CAPACITY", "올바른 수량을 입력해 주세요.");
    }
    let ticketTypeId = String(body.ticketTypeId || "").trim();
    const sessionId = String(body.sessionId || "").trim();
    if (!ticketTypeId && sessionId) {
      const dash = await fetchPlatformAdminDashboard();
      const found = dash.sessions.find((s) => s.id === sessionId);
      ticketTypeId = found?.ticket_type_id || "";
    }
    if (!ticketTypeId) {
      throw new TicketingPlatformError(
        404,
        "TICKET_TYPE_NOT_FOUND",
        "수정할 티켓 권종을 찾을 수 없습니다."
      );
    }
    await adminClient.updateTicketType(ticketTypeId, { totalQuantity: cap });
    return { ok: true };
  }

  if (action === "set_status") {
    const id = String(body.id || "").trim();
    const status = String(body.status || "");
    if (status === "cancelled") {
      if (!id) {
        throw new TicketingPlatformError(400, "INVALID_ID", "예매 ID가 필요합니다.");
      }
      await adminClient.cancelReservation(id);
      return { ok: true };
    }
    throw new TicketingPlatformError(
      400,
      "UNSUPPORTED_RESTORE",
      "취소된 예매는 복원할 수 없습니다. 새로 예매해 주세요."
    );
  }

  if (action === "toggle_checkin") {
    return { ok: true, localOnly: true };
  }

  throw new TicketingPlatformError(400, "UNKNOWN_ACTION", "지원하지 않는 관리자 작업입니다.");
}

/**
 * Export live platform reservations as CSV string.
 */
export async function exportPlatformAdminCsv({ showId = "", sessionId = "" }) {
  const dash = await fetchPlatformAdminDashboard();
  if (dash.adminKeyMissing) {
    throw new TicketingPlatformError(
      503,
      "ADMIN_KEY_MISSING",
      "TICKETING_ADMIN_KEY(sk_live_...)가 설정되지 않아 CSV를 내보낼 수 없습니다."
    );
  }

  const rows = dash.reservations
    .filter(
      (r) =>
        (!showId || r.show_id === showId) && (!sessionId || r.session_id === sessionId)
    )
    .sort((a, b) => a.round_number - b.round_number || a.name.localeCompare(b.name, "ko"));

  const header = [
    "예매번호",
    "공연명",
    "회차",
    "공연일",
    "공연시간",
    "예매자",
    "전화번호",
    "뒷자리4자리",
    "상태",
    "예매시각",
  ];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    header.map(escape).join(","),
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
        "예매확정",
        r.created_at,
      ]
        .map(escape)
        .join(",")
    ),
  ];

  return lines.join("\r\n");
}
