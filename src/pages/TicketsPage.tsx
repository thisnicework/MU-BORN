import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  Search,
  Trash2,
  Check,
  Lock,
  Instagram,
  ArrowUpRight,
} from "lucide-react";
import {
  DINOZ_WORK,
  SEMOKKEUT_WORK,
  BOOKING_NOTES,
  TICKET_RECEIPT_GUIDE,
  ONSITE_TICKET_GUIDE,
} from "@/data/content";
import { LOGOS } from "@/data/logos";
import { BarcodeSvg, SectionFolio } from "@/components/CuteArt";

interface PublicSession {
  id: string;
  roundNumber: number;
  label: string;
  dateStr: string;
  timeStr: string;
  isSoldOut: boolean;
  ticketTypeId?: string | null;
  ticketTypeName?: string;
  salesStatus?: "open" | "upcoming" | "closed";
}

interface PublicShow {
  id: string;
  eventId?: string;
  title: string;
  openAt: string;
  isOpen: boolean;
  pendingSchedules?: boolean;
  loadError?: string;
  venue: string;
  sessions: PublicSession[];
}

interface CreatedTicket {
  bookingCode: string;
  showTitle: string;
  venue: string;
  sessionLabel: string;
  dateStr: string;
  timeStr: string;
  name: string;
  phoneLast4: string;
}

interface LookupRow {
  id: number | string;
  booking_code: string;
  show_id: string;
  show_title: string;
  show_venue: string;
  session_label: string;
  date_str: string;
  time_str: string;
  name: string;
  phone_last4: string;
  checked_in: number;
  created_at: string;
  can_cancel?: boolean;
}

function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function TicketsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialShow = searchParams.get("show") === "semokkeut" ? "semokkeut" : "dinoz";

  const [shows, setShows] = useState<PublicShow[]>([]);
  const [loadingShows, setLoadingShows] = useState(true);
  const [selectedShowId, setSelectedShowId] = useState<string>(initialShow);
  const [mode, setMode] = useState<"book" | "lookup">("book");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneConfirm, setPhoneConfirm] = useState("");
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [createdTickets, setCreatedTickets] = useState<CreatedTicket[] | null>(null);

  const [lookupBy, setLookupBy] = useState<"name" | "code">("name");
  const [lookupName, setLookupName] = useState("");
  const [lookupCode, setLookupCode] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupResults, setLookupResults] = useState<LookupRow[] | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const fetchShows = useCallback(async () => {
    try {
      setLoadingShows(true);
      const res = await fetch("/api/shows", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "공연 정보를 불러오지 못했습니다.");
      }
      setShows(data.shows || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "공연 정보를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요."
      );
    } finally {
      setLoadingShows(false);
    }
  }, []);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  const activeShow = shows.find((s) => s.id === selectedShowId);
  const activeWorkMeta = selectedShowId === "dinoz" ? DINOZ_WORK : SEMOKKEUT_WORK;

  const phoneDigits = phone.replace(/\D/g, "");
  const confirmDigits = phoneConfirm.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.startsWith("01");
  const isPhoneMatched = isPhoneValid && phoneDigits === confirmDigits;

  const handleSelectShow = (id: string) => {
    setSelectedShowId(id);
    setSelectedSessionIds([]);
    setError("");
    setCreatedTickets(null);
    setSearchParams({ show: id }, { replace: true });
  };

  const toggleSession = (sid: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("예매자 성함을 2자 이상 정확히 입력해 주세요.");
      return;
    }
    if (!isPhoneValid) {
      setError("올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)");
      return;
    }
    if (!isPhoneMatched) {
      setError("전화번호와 전화번호 확인이 일치하지 않습니다.");
      return;
    }
    if (selectedSessionIds.length === 0) {
      setError("관람하실 회차를 최소 1개 이상 선택해 주세요.");
      return;
    }
    if (!agreed) {
      setError("예매 유의사항 및 현장 수령 안내에 동의해 주세요.");
      return;
    }
    setConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError("");
    try {
      const ticketTypeMap: Record<string, string> = {};
      for (const s of activeShow?.sessions || []) {
        if (selectedSessionIds.includes(s.id) && s.ticketTypeId) {
          ticketTypeMap[s.id] = s.ticketTypeId;
        }
      }
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId: selectedShowId,
          name: name.trim(),
          phone,
          phoneConfirm,
          sessionIds: selectedSessionIds,
          ticketTypeMap,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setConfirmModal(false);
        setError(data.error || "예매에 실패했습니다.");
        await fetchShows();
        return;
      }
      setConfirmModal(false);
      setCreatedTickets(data.tickets || []);
      setSelectedSessionIds([]);
      await fetchShows();
    } catch {
      setConfirmModal(false);
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    setLookupResults(null);
    if (lookupPhone.replace(/\D/g, "").length < 10) {
      setLookupError("전화번호를 정확히 입력해 주세요.");
      return;
    }
    if (lookupBy === "name" && !lookupName.trim()) {
      setLookupError("예매자 성함을 입력해 주세요.");
      return;
    }
    if (lookupBy === "code" && !lookupCode.trim()) {
      setLookupError("예매번호를 입력해 주세요.");
      return;
    }
    setLookupLoading(true);
    try {
      const qs = new URLSearchParams({
        phone: lookupPhone,
        ...(lookupBy === "code"
          ? { code: lookupCode.trim() }
          : { name: lookupName.trim() }),
      });
      const res = await fetch(`/api/reservations?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setLookupError(data.error || "조회에 실패했습니다.");
        return;
      }
      setLookupResults(data.reservations || []);
    } catch {
      setLookupError("조회 중 오류가 발생했습니다.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCancelTicket = async (bookingCode: string) => {
    if (!window.confirm(`예매번호 [${bookingCode}] 예매를 정말 취소하시겠습니까?`)) {
      return;
    }
    try {
      const res = await fetch("/api/reservations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingCode, phone: lookupPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "취소에 실패했습니다.");
        return;
      }
      setLookupResults((prev) =>
        prev ? prev.filter((r) => r.booking_code !== bookingCode) : prev
      );
      await fetchShows();
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  const selectedSessionsDetail =
    activeShow?.sessions.filter((s) => selectedSessionIds.includes(s.id)) || [];

  return (
    <div className="pt-16 md:pt-[68px] min-h-screen bg-[#FAF9F4] text-[#1D3C63]">
      {/* Masthead Band */}
      <section className="bg-[#FCF686] py-14 sm:py-20 border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionFolio index="00" title="ONLINE RESERVATION" meta="2026 MU:BORN BOX OFFICE" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1D3C63] print-display">
                티켓 예매
              </h1>
              <p className="text-sm text-[#1D3C63]/75">
                전석 무료 관람 · 회차당 1인 1매 (복수 회차 개별 선택 가능)
              </p>
            </div>

            <div className="inline-flex border border-[#1D3C63] bg-white self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMode("book")}
                className={`px-5 py-2.5 text-xs sm:text-sm font-bold transition-colors ${
                  mode === "book"
                    ? "bg-[#1D3C63] text-[#FCF686]"
                    : "text-[#1D3C63] hover:bg-[#FAF9F4]"
                }`}
              >
                티켓 예매하기
              </button>
              <button
                type="button"
                onClick={() => setMode("lookup")}
                className={`px-5 py-2.5 text-xs sm:text-sm font-bold border-l border-[#1D3C63] transition-colors flex items-center gap-1.5 ${
                  mode === "lookup"
                    ? "bg-[#1D3C63] text-[#FCF686]"
                    : "text-[#1D3C63] hover:bg-[#FAF9F4]"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                예매 조회 / 취소
              </button>
            </div>
          </div>

          {/* 2-Column Ruled Show Selector */}
          {mode === "book" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#1D3C63]/20 bg-white">
              {[
                {
                  id: "dinoz",
                  num: "01",
                  logo: LOGOS.dinozKrBlack,
                  logoH: "h-7",
                  openLabel: "2026.11.22.(SUN) 20:00",
                },
                {
                  id: "semokkeut",
                  num: "02",
                  logo: LOGOS.semokkeutBlack,
                  logoH: "h-9",
                  openLabel: "2026.12.03.(THU) 20:00",
                },
              ].map((item) => {
                const live = shows.find((s) => s.id === item.id);
                const isOpen = live ? live.isOpen : false;
                const selected = selectedShowId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectShow(item.id)}
                    className={`text-left p-6 border-r border-b border-[#1D3C63]/20 transition-colors flex items-center justify-between gap-4 ${
                      selected
                        ? "bg-white ring-2 ring-inset ring-[#1D3C63]"
                        : "bg-white/60 hover:bg-[#FAF9F4]"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="print-num text-xs font-bold text-[#1D3C63]/45">
                          {item.num}
                        </span>
                        <span
                          className={`px-2 py-0.5 print-eyebrow ${
                            isOpen
                              ? "bg-[#8DB4E2]/45 text-[#1D3C63]"
                              : "bg-[#C5DB9B]/60 text-[#1D3C63]"
                          }`}
                        >
                          {isOpen ? "TICKET OPEN" : "COMING SOON"}
                        </span>
                      </div>
                      <img src={item.logo} alt={item.id} className={`${item.logoH} w-auto object-contain`} />
                      <div className="print-num text-xs font-semibold text-[#1D3C63]/65">
                        오픈 일정 · {item.openLabel}
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 border flex items-center justify-center shrink-0 ${
                        selected
                          ? "bg-[#1D3C63] border-[#1D3C63] text-[#FCF686]"
                          : "border-[#1D3C63]/30 bg-white"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {mode === "book" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              {loadingShows ? (
                <div className="bg-white border border-[#1D3C63]/16 p-12 text-center text-[#1D3C63]/60 text-sm">
                  공연 회차 정보를 불러오는 중입니다...
                </div>
              ) : createdTickets ? (
                /* Printed Ticket Stub Confirmation */
                <div className="bg-white border border-[#1D3C63]/20 p-7 sm:p-10 space-y-8">
                  <div className="flex items-start gap-4 pb-6 border-b print-rule">
                    <CheckCircle2 className="w-7 h-7 text-[#1D3C63] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="print-eyebrow text-[#1D3C63]/50">CONFIRMED</span>
                      <h2 className="text-2xl font-bold text-[#1D3C63]">
                        티켓 예매가 완료되었습니다
                      </h2>
                      <p className="text-sm text-[#1D3C63]/65">
                        아래 모바일 티켓을 캡처해 두시거나, 상단 &lsquo;예매 조회&rsquo;에서 확인하실 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {createdTickets.map((t) => (
                      <div
                        key={t.bookingCode}
                        className="bg-[#1D3C63] text-white border border-[#1D3C63] grid grid-cols-1 sm:grid-cols-12"
                      >
                        <div className="sm:col-span-8 p-6 space-y-3 sm:border-r sm:border-dashed sm:border-white/25">
                          <div className="flex items-center justify-between gap-2">
                            <span className="print-eyebrow text-[#FCF686]">
                              ADMIT ONE · {t.sessionLabel}
                            </span>
                            <span className="print-num text-xs font-bold px-2.5 py-0.5 bg-[#FCF686] text-[#1D3C63]">
                              {t.bookingCode}
                            </span>
                          </div>
                          <div className="text-lg font-bold pt-1">{t.showTitle}</div>
                          <div className="print-num text-sm font-bold text-[#FCF686]">
                            {t.dateStr} {t.timeStr}
                          </div>
                          <div className="text-xs text-white/75 pt-2 space-y-0.5">
                            <div>장소 · {t.venue}</div>
                            <div>
                              예매자 · {t.name} (연락처 뒷자리 {t.phoneLast4})
                            </div>
                          </div>
                        </div>
                        <div className="sm:col-span-4 p-6 bg-[#132A47] flex flex-row sm:flex-col items-center justify-between gap-4">
                          <img src={LOGOS.mubornBlackWhiteOutline} alt="MU:BORN" className="h-5" />
                          <div className="text-center space-y-1">
                            <BarcodeSvg className="h-6 w-24 text-[#FCF686]" />
                            <div className="print-num text-[10px] text-white/55">FREE SEAT</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FAF9F4] border-l-2 border-[#1D3C63] p-5 text-xs text-[#1D3C63]/80 leading-[1.75] space-y-1">
                    <div className="font-bold text-[#1D3C63]">현장 티켓 수령 안내</div>
                    <div>• 공연 시작 1시간 전부터 티켓부스에서 예매자 성함 및 연락처 뒷자리 확인 후 수령 가능합니다.</div>
                    <div>• 공연 시작 5분 전까지 미수령 시 현장 예매로 전환됩니다.</div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreatedTickets(null);
                        setName("");
                        setPhone("");
                        setPhoneConfirm("");
                        setAgreed(false);
                      }}
                      className="px-6 py-3 bg-[#1D3C63] text-[#FCF686] font-bold text-sm"
                    >
                      추가 예매하기
                    </button>
                    <Link
                      to="/guide"
                      className="px-6 py-3 border border-[#1D3C63] hover:bg-[#FCF686] text-[#1D3C63] font-bold text-sm"
                    >
                      관람 안내 보기
                    </Link>
                  </div>
                </div>
              ) : activeShow && !activeShow.isOpen ? (
                <div className="bg-white border border-[#1D3C63]/16 p-10 sm:p-14 text-center space-y-6">
                  <div className="w-12 h-12 bg-[#FCF686] text-[#1D3C63] flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-[#C5DB9B]/60 text-[#1D3C63] print-eyebrow">
                      COMING SOON
                    </span>
                    <h2 className="text-2xl font-bold text-[#1D3C63]">{activeShow.title}</h2>
                    <p className="print-num text-lg font-bold text-[#1D3C63]">
                      티켓 오픈 · {activeShow.openAt}
                    </p>
                  </div>
                  <p className="text-sm text-[#1D3C63]/65 max-w-md mx-auto leading-[1.8]">
                    {activeShow.pendingSchedules
                      ? "현재 예매 회차를 준비 중입니다. 오픈 일정에 맞춰 본 페이지에서 바로 예매하실 수 있습니다."
                      : "예매 오픈 시각에 맞춰 본 페이지에서 티켓 예매가 열립니다."}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <Link
                      to={`/works/${activeShow.id}`}
                      className="px-6 py-3 bg-[#1D3C63] text-[#FCF686] font-bold text-sm"
                    >
                      작품 상세 정보
                    </Link>
                  </div>
                </div>
              ) : !activeShow ? (
                <div className="bg-white border border-[#1D3C63]/16 p-10 sm:p-14 text-center space-y-4">
                  <AlertCircle className="w-7 h-7 text-red-600 mx-auto" />
                  <p className="text-sm text-[#1D3C63]/80">
                    {error || "공연 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
                  </p>
                  <button
                    type="button"
                    onClick={fetchShows}
                    className="px-5 py-2.5 bg-[#1D3C63] text-[#FCF686] text-xs font-bold"
                  >
                    다시 불러오기
                  </button>
                </div>
              ) : activeShow ? (
                /* Swiss Editorial Booking Form */
                <form
                  onSubmit={handlePreSubmit}
                  className="bg-white border border-[#1D3C63]/16 p-7 sm:p-10 space-y-9"
                >
                  <div className="flex items-end justify-between gap-4 pb-5 border-b border-[#1D3C63]">
                    <div className="space-y-1">
                      <span className="print-eyebrow text-[#1D3C63]/50">RESERVATION FORM</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1D3C63]">
                        {activeShow.title}
                      </h2>
                    </div>
                    <span className="px-3 py-1 bg-[#FCF686] text-[#1D3C63] print-eyebrow shrink-0">
                      FREE
                    </span>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-2 border-red-600 p-4 flex items-start gap-2.5 text-sm text-red-700">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Step 01 */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b print-rule">
                      <span className="print-num text-xs font-bold text-[#1D3C63]">01</span>
                      <h3 className="text-sm font-bold text-[#1D3C63]">예매자 정보 입력</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1D3C63]/70 mb-2">
                        예매자 성함 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="실명을 입력해 주세요 (예: 홍길동)"
                        className="w-full px-4 py-3 border border-[#1D3C63]/25 bg-[#FAF9F4]/40 text-sm focus:outline-none focus:border-[#1D3C63] focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#1D3C63]/70 mb-2">
                          전화번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                          placeholder="010-0000-0000"
                          className="w-full px-4 py-3 border border-[#1D3C63]/25 bg-[#FAF9F4]/40 text-sm print-num focus:outline-none focus:border-[#1D3C63] focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1D3C63]/70 mb-2">
                          전화번호 확인 (재입력) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          value={phoneConfirm}
                          onChange={(e) => setPhoneConfirm(formatPhoneInput(e.target.value))}
                          placeholder="한 번 더 입력해 주세요"
                          className={`w-full px-4 py-3 border text-sm print-num focus:outline-none transition-colors ${
                            phoneConfirm.length > 0
                              ? isPhoneMatched
                                ? "border-emerald-600 bg-emerald-50/40"
                                : "border-red-500 bg-red-50/40"
                              : "border-[#1D3C63]/25 bg-[#FAF9F4]/40 focus:border-[#1D3C63] focus:bg-white"
                          }`}
                        />
                      </div>
                    </div>

                    {phoneConfirm.length > 0 && (
                      <p
                        className={`text-xs font-semibold ${
                          isPhoneMatched ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {isPhoneMatched
                          ? "✓ 전화번호가 일치합니다. 현장 수령 시 뒷자리 4자리가 확인됩니다."
                          : "✕ 입력하신 두 전화번호가 일치하지 않습니다."}
                      </p>
                    )}
                  </div>

                  {/* Step 02: Sessions (NO max/remaining capacity shown publicly!) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b print-rule">
                      <div className="flex items-center gap-2.5">
                        <span className="print-num text-xs font-bold text-[#1D3C63]">02</span>
                        <h3 className="text-sm font-bold text-[#1D3C63]">
                          관람 회차 선택 (복수 선택 가능)
                        </h3>
                      </div>
                      <span className="text-xs text-[#1D3C63]/55">회차당 1인 1매</span>
                    </div>

                    <div className="divide-y divide-[#1D3C63]/16 border border-[#1D3C63]/20">
                      {activeShow.sessions.map((sess) => {
                        const checked = selectedSessionIds.includes(sess.id);
                        const disabled =
                          sess.isSoldOut ||
                          sess.salesStatus === "upcoming" ||
                          sess.salesStatus === "closed";
                        return (
                          <button
                            key={sess.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => toggleSession(sess.id)}
                            className={`w-full text-left px-5 py-4 transition-colors flex items-center justify-between gap-4 ${
                              disabled
                                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                : checked
                                ? "bg-[#FCF686]/65 text-[#1D3C63]"
                                : "bg-white hover:bg-[#FAF9F4] text-[#1D3C63]"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                                  disabled
                                    ? "bg-neutral-200 border-neutral-300"
                                    : checked
                                    ? "bg-[#1D3C63] border-[#1D3C63] text-[#FCF686]"
                                    : "border-[#1D3C63]/35 bg-white"
                                }`}
                              >
                                {checked && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <span className="print-eyebrow text-[#1D3C63]/55 block">
                                  ROUND 0{sess.roundNumber} · {sess.label}
                                </span>
                                <span className="print-num text-[15.5px] font-bold">
                                  {sess.dateStr} {sess.timeStr}
                                </span>
                              </div>
                            </div>

                            <span
                              className={`px-3 py-1 print-eyebrow shrink-0 ${
                                disabled
                                  ? "bg-neutral-200 text-neutral-500"
                                  : checked
                                  ? "bg-[#1D3C63] text-[#FCF686]"
                                  : "bg-[#C5DB9B]/55 text-[#1D3C63]"
                              }`}
                            >
                              {sess.salesStatus === "upcoming"
                                ? "COMING SOON"
                                : sess.salesStatus === "closed"
                                ? "CLOSED"
                                : sess.isSoldOut
                                ? "SOLD OUT"
                                : checked
                                ? "SELECTED"
                                : "OPEN"}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedSessionIds.length > 0 && (
                      <div className="bg-[#FAF9F4] border-l-2 border-[#1D3C63] px-4 py-3 text-xs sm:text-sm font-bold text-[#1D3C63]">
                        총 {selectedSessionIds.length}개 회차 선택됨 (각 회차 1인 1매 · 무료)
                      </div>
                    )}
                  </div>

                  {/* Step 03 */}
                  <label className="flex items-start gap-3 p-4 bg-[#FAF9F4] border border-[#1D3C63]/15 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#1D3C63]"
                    />
                    <span className="text-xs sm:text-[13.5px] text-[#1D3C63]/80 leading-[1.72]">
                      <strong>예매 및 현장 수령 유의사항</strong>을 확인했으며, 티켓 수령 확인을 위한
                      성함·연락처 수집에 동의합니다. (공연 시작 5분 전 미수령 시 현장 예매 전환)
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    <span>예매 정보 확인 및 신청하기</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
              ) : null}
            </div>

            {/* Right Program-Book Spec Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#1D3C63]/16 p-6 sm:p-7 space-y-6">
                <div className="flex items-start gap-4">
                  <img
                    src={activeWorkMeta.poster}
                    alt={activeWorkMeta.fullTitle}
                    className="w-20 h-28 object-cover border border-[#1D3C63]/15 shrink-0"
                  />
                  <div className="space-y-1.5">
                    <span className="print-eyebrow text-[#1D3C63]/45">INFORMATION</span>
                    <h3 className="text-lg font-bold text-[#1D3C63] leading-snug">
                      {activeWorkMeta.info.공연명}
                    </h3>
                    <Link
                      to={`/works/${activeWorkMeta.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1D3C63]/70 hover:text-[#1D3C63] underline pt-1"
                    >
                      <span>작품 상세 페이지</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <dl className="divide-y divide-[#1D3C63]/12 border-t print-rule text-[13.5px]">
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <dt className="col-span-4 text-[#1D3C63]/55 font-medium">러닝타임</dt>
                    <dd className="col-span-8 font-semibold text-[#1D3C63]">
                      {activeWorkMeta.info.러닝타임}
                    </dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <dt className="col-span-4 text-[#1D3C63]/55 font-medium">공연일시</dt>
                    <dd className="col-span-8 font-semibold text-[#1D3C63] print-num space-y-0.5">
                      {activeWorkMeta.info.공연일시.map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <dt className="col-span-4 text-[#1D3C63]/55 font-medium">공연장소</dt>
                    <dd className="col-span-8 font-semibold text-[#1D3C63]">
                      {activeWorkMeta.info.공연장소}
                    </dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <dt className="col-span-4 text-[#1D3C63]/55 font-medium">지도교수</dt>
                    <dd className="col-span-8 font-semibold text-[#1D3C63]">
                      {activeWorkMeta.info.지도교수}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white border border-[#1D3C63]/16 p-6 sm:p-7 space-y-4">
                <h3 className="print-eyebrow text-[#1D3C63] pb-3 border-b print-rule">
                  BOOKING NOTE
                </h3>
                <ul className="space-y-2.5 text-[13.5px] text-[#1D3C63]/80 leading-[1.76]">
                  {BOOKING_NOTES.map((note, idx) => (
                    <li key={idx} className="grid grid-cols-[14px_1fr] gap-1.5">
                      <span className="font-bold text-[#1D3C63]/40">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t print-rule flex items-center justify-between text-xs">
                  <Link to="/guide" className="font-bold text-[#1D3C63] hover:underline">
                    전체 관람 안내 →
                  </Link>
                  <a
                    href="https://www.instagram.com/sia.bfa.muborn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#1D3C63]/70 hover:text-[#1D3C63]"
                  >
                    <Instagram className="w-4 h-4" />
                    @sia.bfa.muborn
                  </a>
                </div>
              </div>

              <div className="bg-[#1D3C63] text-white p-6 sm:p-7 space-y-3">
                <h3 className="print-eyebrow text-[#FCF686]">
                  TICKET RECEIPT &amp; ON-SITE TICKET
                </h3>
                <ul className="space-y-2 text-xs text-white/80 leading-[1.75]">
                  {TICKET_RECEIPT_GUIDE.slice(0, 3).map((t, i) => (
                    <li key={i} className="grid grid-cols-[12px_1fr] gap-1">
                      <span>•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                  {ONSITE_TICKET_GUIDE.slice(0, 2).map((t, i) => (
                    <li key={`o-${i}`} className="grid grid-cols-[12px_1fr] gap-1">
                      <span>•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Lookup & Cancel */
          <div className="max-w-2xl mx-auto space-y-6">
            <form
              onSubmit={handleLookup}
              className="bg-white border border-[#1D3C63]/16 p-7 sm:p-9 space-y-6"
            >
              <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-[#1D3C63]">
                <div>
                  <span className="print-eyebrow text-[#1D3C63]/50">RESERVATION LOOKUP</span>
                  <h2 className="text-xl font-bold text-[#1D3C63] mt-1">예매 내역 조회</h2>
                </div>
                <div className="inline-flex border border-[#1D3C63]/25 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setLookupBy("name");
                      setLookupError("");
                    }}
                    className={`px-3 py-1.5 transition-colors ${
                      lookupBy === "name"
                        ? "bg-[#1D3C63] text-[#FCF686] font-bold"
                        : "bg-[#FAF9F4] text-[#1D3C63]/70"
                    }`}
                  >
                    성함으로 조회
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLookupBy("code");
                      setLookupError("");
                    }}
                    className={`px-3 py-1.5 border-l border-[#1D3C63]/25 transition-colors ${
                      lookupBy === "code"
                        ? "bg-[#1D3C63] text-[#FCF686] font-bold"
                        : "bg-[#FAF9F4] text-[#1D3C63]/70"
                    }`}
                  >
                    예매번호로 조회
                  </button>
                </div>
              </div>

              {lookupError && (
                <div className="bg-red-50 border-l-2 border-red-600 p-3.5 text-sm text-red-700">
                  {lookupError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {lookupBy === "name" ? (
                  <div>
                    <label className="block text-xs font-bold text-[#1D3C63]/70 mb-2">
                      예매자 성함
                    </label>
                    <input
                      type="text"
                      required
                      value={lookupName}
                      onChange={(e) => setLookupName(e.target.value)}
                      placeholder="성함 입력"
                      className="w-full px-4 py-3 border border-[#1D3C63]/25 bg-[#FAF9F4]/40 text-sm focus:outline-none focus:border-[#1D3C63] focus:bg-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#1D3C63]/70 mb-2">
                      예매번호
                    </label>
                    <input
                      type="text"
                      required
                      value={lookupCode}
                      onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                      placeholder="예매번호 입력"
                      className="w-full px-4 py-3 border border-[#1D3C63]/25 bg-[#FAF9F4]/40 text-sm print-num focus:outline-none focus:border-[#1D3C63] focus:bg-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-[#1D3C63]/70 mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(formatPhoneInput(e.target.value))}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 border border-[#1D3C63]/25 bg-[#FAF9F4]/40 text-sm print-num focus:outline-none focus:border-[#1D3C63] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="w-full py-3.5 bg-[#1D3C63] text-[#FCF686] font-bold text-sm"
              >
                {lookupLoading ? "조회 중..." : "예매 내역 조회하기"}
              </button>
            </form>

            {lookupResults !== null && (
              <div className="space-y-4">
                {lookupResults.length === 0 ? (
                  <div className="bg-white border border-[#1D3C63]/16 p-10 text-center text-sm text-[#1D3C63]/55">
                    입력하신 정보로 확인된 예매 내역이 없습니다.
                  </div>
                ) : (
                  lookupResults.map((r) => (
                    <div
                      key={r.booking_code}
                      className="bg-white border border-[#1D3C63]/16 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="print-num text-xs font-bold px-2.5 py-0.5 bg-[#1D3C63] text-[#FCF686]">
                            {r.booking_code}
                          </span>
                          <span className="text-xs font-bold text-emerald-700">
                            {r.checked_in ? "티켓 수령 완료" : "예매 확정"}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-[#1D3C63] pt-0.5">
                          {r.show_title} · {r.session_label}
                        </div>
                        <div className="print-num text-sm font-semibold text-[#1D3C63]">
                          {r.date_str} {r.time_str}
                        </div>
                        <div className="text-xs text-[#1D3C63]/60">
                          {r.show_venue} · 예매자 {r.name} (뒷자리 {r.phone_last4})
                        </div>
                      </div>

                      {!r.checked_in && r.can_cancel !== false ? (
                        <button
                          type="button"
                          onClick={() => handleCancelTicket(r.booking_code)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>예매 취소</span>
                        </button>
                      ) : !r.checked_in ? (
                        <a
                          href="https://www.instagram.com/sia.bfa.muborn/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-[#1D3C63]/20 text-[#1D3C63]/70 hover:text-[#1D3C63] text-xs font-semibold shrink-0"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          <span>취소·변경 DM 문의</span>
                        </a>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && activeShow && (
        <div
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !submitting && setConfirmModal(false)}
        >
          <div
            className="w-full max-w-md bg-white border border-[#1D3C63] p-7 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-4 border-b border-[#1D3C63]">
              <span className="print-eyebrow text-[#1D3C63]/50">CONFIRM RESERVATION</span>
              <h3 className="text-xl font-bold text-[#1D3C63] mt-1">
                예매 내용을 최종 확인해 주세요
              </h3>
            </div>

            <dl className="divide-y divide-[#1D3C63]/12 border-y print-rule text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-[#1D3C63]/55">공연명</dt>
                <dd className="font-bold text-[#1D3C63]">{activeShow.title}</dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-[#1D3C63]/55">예매자 성함</dt>
                <dd className="font-bold text-[#1D3C63]">{name.trim()}</dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-[#1D3C63]/55">전화번호</dt>
                <dd className="font-bold text-[#1D3C63] print-num">{phone}</dd>
              </div>
              <div className="py-3 space-y-1.5">
                <dt className="text-[#1D3C63]/55 text-xs">선택 회차 (회차당 1인 1매)</dt>
                <dd className="font-bold text-[#1D3C63] print-num space-y-0.5">
                  {selectedSessionsDetail.map((s) => (
                    <div key={s.id}>
                      • {s.label}: {s.dateStr} {s.timeStr}
                    </div>
                  ))}
                </dd>
              </div>
            </dl>

            <p className="text-xs text-[#1D3C63]/65 leading-relaxed">
              현장 티켓 수령 시 위 성함과 전화번호 뒷자리({phoneDigits.slice(-4)})를 확인합니다.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setConfirmModal(false)}
                className="py-3 border border-[#1D3C63] text-[#1D3C63] font-bold text-sm hover:bg-[#FAF9F4]"
              >
                수정하기
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmBooking}
                className="py-3 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] font-bold text-sm"
              >
                {submitting ? "처리 중..." : "최종 예매 확정"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
