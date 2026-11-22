import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

/** Flat borderless claw gripper (hangs flush from a top edge) */
export function ClawGripper({ className = "w-14 h-18" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 136" fill="none" className={className} aria-hidden="true">
      <rect x="53" y="0" width="14" height="42" fill="#1D3C63" />
      <rect x="36" y="40" width="48" height="22" rx="3" fill="#1D3C63" />
      <circle cx="60" cy="51" r="4.5" fill="#FCF686" />
      <path d="M43 60 L20 94 L32 128 L42 123 L33 96 L50 66 Z" fill="#1D3C63" />
      <path d="M77 60 L100 94 L88 128 L78 123 L87 96 L70 66 Z" fill="#1D3C63" />
    </svg>
  );
}

/** Editorial vignette: Sage-green alien + 2 drifting warm stars (for <다이노즈> open negative space) */
export function DinozVignette({ className = "w-36 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 168 128" fill="none" className={className} aria-hidden="true">
      {/* Warm golden 5-point star upper right */}
      <path
        d="M126 14 L131 28 L146 29.5 L134.5 39 L138 53 L126 45 L114 53 L117.5 39 L106 29.5 L121 28 Z"
        fill="#EAB64D"
      />
      {/* Small crisp navy/accent star lower left */}
      <path
        d="M20 74 L23 82 L31.5 83 L25 88.5 L27 97 L20 92.2 L13 97 L15 88.5 L8.5 83 L17 82 Z"
        fill="#1D3C63"
        opacity="0.78"
      />
      {/* Cute flat sage-green alien slightly tilted */}
      <g transform="translate(36 22) rotate(-7 42 46)">
        <line x1="29" y1="24" x2="21" y2="10" stroke="#A6C47B" strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="20" cy="8.5" r="4.2" fill="#A6C47B" />
        <line x1="55" y1="24" x2="63" y2="10" stroke="#A6C47B" strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="64" cy="8.5" r="4.2" fill="#A6C47B" />
        <path
          d="M42 20 C62 20 72 36 70 55 C68 72 54 86 42 86 C30 86 16 72 14 55 C12 36 22 20 42 20 Z"
          fill="#B8D091"
        />
        <ellipse cx="30" cy="52" rx="6.2" ry="10" transform="rotate(-18 30 52)" fill="#1D3C63" />
        <ellipse cx="54" cy="52" rx="6.2" ry="10" transform="rotate(18 54 52)" fill="#1D3C63" />
        <circle cx="28.5" cy="48.5" r="1.8" fill="#FAF9F4" />
        <circle cx="52.5" cy="48.5" r="1.8" fill="#FAF9F4" />
        <path d="M38 69 Q42 72.5 46 69" stroke="#1D3C63" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Editorial vignette: Sage-green storybook + drifting warm stars (for <세모끝> open negative space) */
export function SemokkeutVignette({ className = "w-36 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 168 128" fill="none" className={className} aria-hidden="true">
      {/* Large amber star top-right */}
      <path
        d="M132 16 L137.5 31 L153 32.5 L141 42.5 L144.5 57.5 L132 49 L119.5 57.5 L123 42.5 L111 32.5 L126.5 31 Z"
        fill="#EAB64D"
      />
      {/* Small dark navy star bottom-right */}
      <path
        d="M116 88 L119 95.5 L127 96.5 L120.8 101.8 L122.6 109.5 L116 105 L109.4 109.5 L111.2 101.8 L105 96.5 L113 95.5 Z"
        fill="#1D3C63"
        opacity="0.72"
      />
      {/* Soft tilted storybook */}
      <g transform="translate(20 18) rotate(11 46 46)">
        <rect x="24" y="10" width="54" height="72" rx="3" fill="#FAF9F4" />
        <rect x="18" y="13" width="54" height="72" rx="3" fill="#B8D091" />
        <rect x="18" y="13" width="10" height="72" rx="2" fill="#9BB874" />
        <rect x="35" y="27" width="27" height="17" rx="1.5" fill="#FCF686" />
        <line x1="40" y1="33.5" x2="57" y2="33.5" stroke="#1D3C63" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="40" y1="38.5" x2="52" y2="38.5" stroke="#1D3C63" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}

/** Organic Card-2 dark-navy corner scene: alien + tilted storybook + rising golden stars */
export function DarkCornerScene({ className = "w-56 h-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 168" fill="none" className={className} aria-hidden="true">
      {/* Upper golden star */}
      <path
        d="M188 10 L195 30 L216 32 L200 46 L205 66 L188 54.5 L171 66 L176 46 L160 32 L181 30 Z"
        fill="#EAB64D"
      />
      {/* Mid-lower smaller warm star */}
      <path
        d="M196 108 L201.5 122 L216.5 123.5 L205 133 L208.5 147.5 L196 139.5 L183.5 147.5 L187 133 L175.5 123.5 L190.5 122 Z"
        fill="#EAB64D"
        opacity="0.92"
      />
      {/* Tiny yellow sparkle near alien */}
      <path
        d="M28 112 L31.5 121 L41 122 L33.8 128 L36 137 L28 131.8 L20 137 L22.2 128 L15 122 L24.5 121 Z"
        fill="#FCF686"
        opacity="0.9"
      />
      {/* Tilted storybook behind/right */}
      <g transform="translate(108 54) rotate(13 38 42)">
        <rect x="16" y="6" width="52" height="70" rx="3" fill="#FAF9F4" />
        <rect x="11" y="9" width="52" height="70" rx="3" fill="#B8D091" />
        <rect x="11" y="9" width="9" height="70" rx="2" fill="#9BB874" />
        <rect x="27" y="22" width="26" height="16" rx="1.5" fill="#FCF686" />
        <line x1="32" y1="28.5" x2="48" y2="28.5" stroke="#1D3C63" strokeWidth="1.7" strokeLinecap="round" />
        <line x1="32" y1="33.5" x2="43" y2="33.5" stroke="#1D3C63" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* Cute alien peeking gently from bottom-left */}
      <g transform="translate(36 68) rotate(-8 40 46)">
        <line x1="28" y1="22" x2="20" y2="9" stroke="#B8D091" strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="19" cy="7.5" r="4" fill="#B8D091" />
        <line x1="52" y1="22" x2="60" y2="9" stroke="#B8D091" strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="61" cy="7.5" r="4" fill="#B8D091" />
        <path
          d="M40 18 C59 18 69 33 67 51 C65 68 52 82 40 82 C28 82 15 68 13 51 C11 33 21 18 40 18 Z"
          fill="#B8D091"
        />
        <ellipse cx="29" cy="49" rx="6" ry="9.5" transform="rotate(-18 29 49)" fill="#1D3C63" />
        <ellipse cx="51" cy="49" rx="6" ry="9.5" transform="rotate(18 51 49)" fill="#1D3C63" />
        <circle cx="27.5" cy="45.5" r="1.7" fill="#FAF9F4" />
        <circle cx="49.5" cy="45.5" r="1.7" fill="#FAF9F4" />
        <path d="M36 66 Q40 69.5 44 66" stroke="#1D3C63" strokeWidth="2.3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Subtle ambient drifting stars for open dark/yellow negative space */
export function FloatingStars({
  className = "w-24 h-20",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <svg viewBox="0 0 110 88" fill="none" className={className} aria-hidden="true">
      <path
        d="M72 8 L77.5 23 L93 24.5 L81 34.5 L84.5 49.5 L72 41 L59.5 49.5 L63 34.5 L51 24.5 L66.5 23 Z"
        fill="#EAB64D"
      />
      <path
        d="M28 46 L31.5 55.5 L41.5 56.5 L34 63 L36.2 72.5 L28 67 L19.8 72.5 L22 63 L14.5 56.5 L24.5 55.5 Z"
        fill={dark ? "#FCF686" : "#1D3C63"}
        opacity={dark ? "0.9" : "0.75"}
      />
      <circle cx="94" cy="64" r="4.5" fill={dark ? "#8DB4E2" : "#B8D091"} />
    </svg>
  );
}

/** Flat arcade joystick + yellow button deck (sits flush on a bottom border) */
export function JoystickObjet({ className = "w-40 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 72" fill="none" className={className} aria-hidden="true">
      {/* Console deck sitting flush on bottom */}
      <path d="M8 50 L172 50 L180 72 L0 72 Z" fill="#1D3C63" />
      <rect x="20" y="56" width="140" height="4" fill="#2E5485" opacity="0.7" />
      {/* Joystick base, shaft & sage-green ball */}
      <ellipse cx="54" cy="50" rx="18" ry="5" fill="#122742" />
      <rect x="51" y="23" width="6" height="27" fill="#D9E2EC" />
      <circle cx="54" cy="19" r="12" fill="#B8D091" />
      <circle cx="49.5" cy="15" r="3.2" fill="#FAF9F4" opacity="0.75" />
      {/* Yellow arcade push button */}
      <ellipse cx="126" cy="50" rx="22" ry="6" fill="#122742" />
      <rect x="108" y="39" width="36" height="10" rx="5" fill="#FCF686" />
      <ellipse cx="126" cy="39" rx="18" ry="4.5" fill="#FFF9B8" />
    </svg>
  );
}

/** Crisp vertical translucent masking tape strip (homage to MU:BORN calendar card) */
export function MaskingTape({ className = "w-7 h-11" }: { className?: string }) {
  return (
    <div
      className={`bg-white/70 border border-[#1D3C63]/10 backdrop-blur-[1px] pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

/** Crisp Print Barcode */
export function BarcodeSvg({ className = "h-5 w-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 26" fill="currentColor" className={className} aria-hidden="true">
      <rect x="0" y="0" width="3" height="26" />
      <rect x="6" y="0" width="1.5" height="26" />
      <rect x="10" y="0" width="4" height="26" />
      <rect x="17" y="0" width="2" height="26" />
      <rect x="22" y="0" width="1.5" height="26" />
      <rect x="27" y="0" width="5" height="26" />
      <rect x="35" y="0" width="2" height="26" />
      <rect x="40" y="0" width="3.5" height="26" />
      <rect x="47" y="0" width="1.5" height="26" />
      <rect x="52" y="0" width="4.5" height="26" />
      <rect x="60" y="0" width="2" height="26" />
      <rect x="65" y="0" width="3" height="26" />
      <rect x="71" y="0" width="1.5" height="26" />
      <rect x="76" y="0" width="5" height="26" />
      <rect x="84" y="0" width="2" height="26" />
      <rect x="89" y="0" width="3.5" height="26" />
      <rect x="96" y="0" width="1.5" height="26" />
      <rect x="101" y="0" width="4" height="26" />
      <rect x="108" y="0" width="2" height="26" />
      <rect x="113" y="0" width="4" height="26" />
    </svg>
  );
}

/** Program-Book Section Running Header (Folio Bar) */
export function SectionFolio({
  index,
  title,
  meta,
  dark = false,
}: {
  index: string;
  title: string;
  meta?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 pb-3.5 border-b ${
        dark ? "border-white/20 text-white/65" : "border-[#1D3C63]/20 text-[#1D3C63]/65"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`print-num text-xs font-bold ${
            dark ? "text-[#FCF686]" : "text-[#1D3C63]"
          }`}
        >
          {index}
        </span>
        <span className="print-eyebrow">{title}</span>
      </div>
      {meta && <span className="print-eyebrow hidden sm:inline">{meta}</span>}
    </div>
  );
}

/** Signature "Follow the arrow" circular directional mark */
export function FollowArrowBadge({ label = "Follow the arrow" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-3">
      {label && <span className="print-eyebrow text-[#1D3C63]/75">{label}</span>}
      <span className="w-9 h-9 rounded-full bg-[#1D3C63] text-[#FCF686] flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </span>
  );
}

type CalendarEventType = "open" | "dinoz" | "semokkeut";

interface CalendarEvent {
  key: string; // e.g. "2026-12-05"
  month: 11 | 12;
  day: number;
  weekday: string;
  type: CalendarEventType;
  cellTag: string;
  badge: string;
  title: string;
  time: string;
  venue: string;
  href: string;
  ctaLabel: string;
}

const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    key: "2026-11-22",
    month: 11,
    day: 22,
    weekday: "SUN",
    type: "open",
    cellTag: "OPEN",
    badge: "TICKET OPEN",
    title: "창작뮤지컬 <다이노즈> 티켓 오픈",
    time: "20:00",
    venue: "온라인 예매 · 전석 무료",
    href: "/tickets?show=dinoz",
    ctaLabel: "예매 바로가기",
  },
  {
    key: "2026-12-03",
    month: 12,
    day: 3,
    weekday: "THU",
    type: "open",
    cellTag: "OPEN",
    badge: "TICKET OPEN",
    title: "창작뮤지컬 <세상 모든 이야기의 끝> 티켓 오픈",
    time: "20:00",
    venue: "온라인 예매 · 전석 무료",
    href: "/tickets?show=semokkeut",
    ctaLabel: "오픈 일정 보기",
  },
  {
    key: "2026-12-05",
    month: 12,
    day: 5,
    weekday: "SAT",
    type: "dinoz",
    cellTag: "DINOZ",
    badge: "SHOW DAY · 1회차",
    title: "창작뮤지컬 <다이노즈>",
    time: "19:00",
    venue: "남산 드라마센터",
    href: "/tickets?show=dinoz",
    ctaLabel: "예매하기",
  },
  {
    key: "2026-12-06",
    month: 12,
    day: 6,
    weekday: "SUN",
    type: "dinoz",
    cellTag: "DINOZ",
    badge: "SHOW DAY · 2·3회차",
    title: "창작뮤지컬 <다이노즈>",
    time: "14:00 / 18:00",
    venue: "남산 드라마센터",
    href: "/tickets?show=dinoz",
    ctaLabel: "예매하기",
  },
  {
    key: "2026-12-19",
    month: 12,
    day: 19,
    weekday: "SAT",
    type: "semokkeut",
    cellTag: "세모끝",
    badge: "SHOW DAY · 1회차",
    title: "창작뮤지컬 <세상 모든 이야기의 끝>",
    time: "19:00",
    venue: "서울예술대학교 빨간대문",
    href: "/works/semokkeut",
    ctaLabel: "작품 보기",
  },
  {
    key: "2026-12-20",
    month: 12,
    day: 20,
    weekday: "SUN",
    type: "semokkeut",
    cellTag: "세모끝",
    badge: "SHOW DAY · 2·3회차",
    title: "창작뮤지컬 <세상 모든 이야기의 끝>",
    time: "14:00 / 18:00",
    venue: "서울예술대학교 빨간대문",
    href: "/works/semokkeut",
    ctaLabel: "작품 보기",
  },
];

// Nov 2026 starts on Sunday (0), 30 days. Dec 2026 starts on Tuesday (2), 31 days.
function buildMonthGrid(month: 11 | 12): Array<number | null> {
  const firstDay = month === 11 ? 0 : 2;
  const totalDays = month === 11 ? 30 : 31;
  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function getDefaultCalendarMonth(): 11 | 12 {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const year = kst.getUTCFullYear();
  const m = kst.getUTCMonth() + 1;
  return year > 2026 || (year === 2026 && m >= 12) ? 12 : 11;
}

/** Swiss Editorial Interactive Program-Book Calendar (NOV & DEC 2026) */
export function TapedCalendar() {
  const defaultMonth = getDefaultCalendarMonth();
  const [month, setMonth] = useState<11 | 12>(defaultMonth);
  const [selectedKey, setSelectedKey] = useState<string>(
    defaultMonth === 12 ? "2026-12-03" : "2026-11-22"
  );

  const cells = buildMonthGrid(month);
  const monthEvents = CALENDAR_EVENTS.filter((e) => e.month === month);
  const selectedEvent =
    CALENDAR_EVENTS.find((e) => e.key === selectedKey) || monthEvents[0];

  const handleMonthSwitch = (nextMonth: 11 | 12) => {
    setMonth(nextMonth);
    const firstEv = CALENDAR_EVENTS.find((e) => e.month === nextMonth);
    if (firstEv) setSelectedKey(firstEv.key);
  };

  return (
    <div className="relative w-full max-w-[460px] bg-white border border-[#1D3C63] text-[#1D3C63]">
      {/* Vertical Translucent Masking Tape Strip (homage to MU:BORN June Calendar card) */}
      <MaskingTape className="w-7 h-11 absolute -top-5 left-1/2 -translate-x-1/2 rotate-[4deg] z-10 shadow-[0_1px_3px_rgba(29,60,99,0.08)]" />
      {/* Masthead Bar */}
      <div className="bg-[#1D3C63] text-white px-5 py-4 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="print-eyebrow text-[#FCF686]">MU:BORN 2026 SCHEDULE</div>
          <div className="font-display text-2xl font-bold tracking-[-0.02em] print-num">
            {month === 11 ? "NOVEMBER 2026" : "DECEMBER 2026"}
          </div>
        </div>

        {/* Clean Month Toggle */}
        <div className="inline-flex items-center border border-white/25 divide-x divide-white/25">
          <button
            type="button"
            onClick={() => handleMonthSwitch(11)}
            aria-label="11월 보기"
            className={`px-2.5 py-1.5 print-num text-xs font-bold transition-colors flex items-center gap-1 ${
              month === 11
                ? "bg-[#FCF686] text-[#1D3C63]"
                : "text-white/75 hover:bg-white/10"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>11</span>
          </button>
          <button
            type="button"
            onClick={() => handleMonthSwitch(12)}
            aria-label="12월 보기"
            className={`px-2.5 py-1.5 print-num text-xs font-bold transition-colors flex items-center gap-1 ${
              month === 12
                ? "bg-[#FCF686] text-[#1D3C63]"
                : "text-white/75 hover:bg-white/10"
            }`}
          >
            <span>12</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Header Row */}
      <div className="grid grid-cols-7 border-b border-[#1D3C63]/20 bg-[#FAF9F4]">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayLabel, i) => (
          <div
            key={dayLabel}
            className={`py-2.5 text-center print-eyebrow text-[10px] ${
              i === 0
                ? "text-[#B5473A]"
                : i === 6
                ? "text-[#1D3C63]"
                : "text-[#1D3C63]/55"
            }`}
          >
            {dayLabel}
          </div>
        ))}
      </div>

      {/* Crisp 1px Hairline Calendar Grid */}
      <div className="grid grid-cols-7 bg-[#1D3C63]/12 gap-px">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="h-14 sm:h-[60px] bg-[#FAF9F4]/60" />;
          }
          const key = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const ev = CALENDAR_EVENTS.find((e) => e.key === key);
          const isSelected = ev && selectedEvent?.key === key;
          const colIdx = idx % 7;

          if (ev) {
            const bgClass =
              ev.type === "open"
                ? "bg-[#FCF686] text-[#1D3C63]"
                : ev.type === "dinoz"
                ? "bg-[#1D3C63] text-white"
                : "bg-[#C5DB9B] text-[#1D3C63]";

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`h-14 sm:h-[60px] p-1.5 flex flex-col items-start justify-between text-left transition-all relative focus:outline-none ${bgClass} ${
                  isSelected
                    ? ev.type === "dinoz"
                      ? "ring-2 ring-inset ring-[#FCF686]"
                      : "ring-2 ring-inset ring-[#1D3C63]"
                    : "hover:opacity-90"
                }`}
              >
                <span className="print-num text-xs sm:text-[13px] font-bold leading-none">
                  {String(day).padStart(2, "0")}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold tracking-tight leading-none ${
                    ev.type === "dinoz" ? "text-[#FCF686]" : "text-[#1D3C63]"
                  }`}
                >
                  {ev.cellTag}
                </span>
              </button>
            );
          }

          return (
            <div
              key={key}
              className="h-14 sm:h-[60px] p-1.5 bg-white flex flex-col items-start justify-between"
            >
              <span
                className={`print-num text-xs leading-none ${
                  colIdx === 0
                    ? "text-[#B5473A]/70"
                    : colIdx === 6
                    ? "text-[#1D3C63]/65"
                    : "text-[#1D3C63]/45"
                }`}
              >
                {String(day).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Selected Date Detail Panel */}
      {selectedEvent && (
        <div className="p-5 bg-[#FAF9F4] border-t border-[#1D3C63] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 print-eyebrow ${
                  selectedEvent.type === "open"
                    ? "bg-[#FCF686] text-[#1D3C63]"
                    : selectedEvent.type === "dinoz"
                    ? "bg-[#1D3C63] text-[#FCF686]"
                    : "bg-[#C5DB9B] text-[#1D3C63]"
                }`}
              >
                {selectedEvent.badge}
              </span>
              <span className="print-num text-xs font-bold text-[#1D3C63]/60">
                2026.{String(selectedEvent.month).padStart(2, "0")}.
                {String(selectedEvent.day).padStart(2, "0")} ({selectedEvent.weekday})
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[15px] font-bold text-[#1D3C63] leading-snug">
                {selectedEvent.title}
              </div>
              <div className="text-xs text-[#1D3C63]/70 print-num">
                {selectedEvent.time} · <span className="font-sans">{selectedEvent.venue}</span>
              </div>
            </div>

            <Link
              to={selectedEvent.href}
              className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] text-xs font-bold transition-colors"
            >
              <span>{selectedEvent.ctaLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Minimal Print Legend */}
      <div className="px-5 py-3 bg-white border-t border-[#1D3C63]/15 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium text-[#1D3C63]/70">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#FCF686] border border-[#1D3C63]/20" />
            티켓 오픈
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#1D3C63]" />
            다이노즈 공연
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#C5DB9B]" />
            세모끝 공연
          </span>
        </div>
        <span className="text-[10px] text-[#1D3C63]/45">날짜 클릭 시 상세 확인</span>
      </div>
    </div>
  );
}
