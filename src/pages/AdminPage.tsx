import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Lock,
  LogOut,
  Download,
  RefreshCw,
  Search,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Check,
} from "lucide-react";
import { SectionFolio } from "@/components/CuteArt";

interface AdminShow {
  id: string;
  title: string;
  open_at: string;
  is_open: number;
  venue: string;
}

interface AdminSession {
  id: string;
  show_id: string;
  round_number: number;
  label: string;
  date_str: string;
  time_str: string;
  max_capacity: number;
  booked_count: number;
  checked_in_count: number;
}

interface AdminReservation {
  id: number;
  booking_code: string;
  show_id: string;
  show_title: string;
  session_id: string;
  session_label: string;
  date_str: string;
  time_str: string;
  round_number: number;
  name: string;
  phone: string;
  phone_last4: string;
  checked_in: number;
  checked_in_at: string | null;
  status: "confirmed" | "cancelled";
  created_at: string;
}

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [shows, setShows] = useState<AdminShow[]>([]);
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterShow, setFilterShow] = useState("all");
  const [filterSession, setFilterSession] = useState("all");
  const [filterStatus, setFilterStatus] = useState("confirmed");
  const [search, setSearch] = useState("");

  const [editingCapId, setEditingCapId] = useState<string | null>(null);
  const [editingCapVal, setEditingCapVal] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setShows(data.shows || []);
      setSessions(data.sessions || []);
      setReservations(data.reservations || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const data = await res.json();
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          await loadDashboard();
        }
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [loadDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error || "로그인 실패");
      return;
    }
    setAuthenticated(true);
    setPassword("");
    await loadDashboard();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  const patchAdmin = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await loadDashboard();
    }
  };

  const filteredReservations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations.filter((r) => {
      if (filterShow !== "all" && r.show_id !== filterShow) return false;
      if (filterSession !== "all" && r.session_id !== filterSession) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.phone_last4.includes(q) ||
        r.booking_code.toLowerCase().includes(q)
      );
    });
  }, [reservations, filterShow, filterSession, filterStatus, search]);

  if (!authChecked) {
    return (
      <div className="pt-32 pb-20 text-center text-sm text-[#1D3C63]/55">
        관리자 인증 상태를 확인하는 중...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="pt-28 pb-24 px-4 min-h-screen bg-[#FAF9F4] flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white border border-[#1D3C63]/20 p-8 space-y-6"
        >
          <div className="pb-4 border-b border-[#1D3C63] space-y-1">
            <span className="print-eyebrow text-[#1D3C63]/50 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> BOX OFFICE ADMIN
            </span>
            <h1 className="text-xl font-bold text-[#1D3C63]">MU:BORN 관리자 로그인</h1>
          </div>

          {loginError && (
            <div className="bg-red-50 border-l-2 border-red-600 p-3 text-xs text-red-700">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1D3C63]/70 mb-2">
              관리자 비밀번호
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 border border-[#1D3C63]/25 bg-[#FAF9F4]/40 text-sm focus:outline-none focus:border-[#1D3C63] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] font-bold text-sm"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  const totalConfirmed = reservations.filter((r) => r.status === "confirmed").length;
  const totalCheckedIn = reservations.filter(
    (r) => r.status === "confirmed" && r.checked_in === 1
  ).length;

  return (
    <div className="pt-16 md:pt-[68px] pb-20 min-h-screen bg-[#FAF9F4] text-[#1D3C63]">
      {/* Masthead */}
      <section className="bg-[#1D3C63] text-white py-10 sm:py-12 border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SectionFolio index="ADMIN" title="BOX OFFICE DASHBOARD" meta="MU:BORN 2026" dark />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">티켓 통합 관리자</h1>
              <p className="text-xs text-white/65 mt-1">
                회차별 최대 수량 · 잔여 수량 확인 / 현장 수령 체크인 / 예매 오픈 제어
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={loadDashboard}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/25 hover:bg-white/10 text-xs font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>새로고침</span>
              </button>
              <a
                href={`/api/admin/export?showId=${filterShow === "all" ? "" : filterShow}&sessionId=${
                  filterSession === "all" ? "" : filterSession
                }`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FCF686] text-[#1D3C63] text-xs font-bold hover:bg-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV 다운로드</span>
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-300/40 text-red-200 hover:bg-red-500/20 text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Swiss 4-Cell KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-[#1D3C63]/16 bg-white">
          {[
            { label: "전체 유효 예매", value: `${totalConfirmed}매`, accent: "text-[#1D3C63]" },
            { label: "현장 수령 완료", value: `${totalCheckedIn}매`, accent: "text-emerald-700" },
            {
              label: "미수령 잔여",
              value: `${totalConfirmed - totalCheckedIn}명`,
              accent: "text-amber-700",
            },
            {
              label: "취소된 예매",
              value: `${reservations.filter((r) => r.status === "cancelled").length}건`,
              accent: "text-[#1D3C63]/45",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="p-6 border-r border-b border-[#1D3C63]/16 space-y-2"
            >
              <div className="print-eyebrow text-[#1D3C63]/50">{kpi.label}</div>
              <div className={`print-num text-3xl font-bold ${kpi.accent}`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Capacity Control (ADMIN ONLY) */}
        <div className="space-y-6">
          {shows.map((show) => {
            const showSessions = sessions.filter((s) => s.show_id === show.id);
            return (
              <div
                key={show.id}
                className="bg-white border border-[#1D3C63]/16 p-6 sm:p-7 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1D3C63]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold text-[#1D3C63]">{show.title}</h2>
                      <span
                        className={`px-2.5 py-0.5 print-eyebrow ${
                          show.is_open
                            ? "bg-[#C5DB9B]/65 text-[#1D3C63]"
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {show.is_open ? "OPEN" : "CLOSED"}
                      </span>
                    </div>
                    <p className="text-xs text-[#1D3C63]/55 print-num">
                      {show.venue} · 오픈 예정 {show.open_at}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      patchAdmin({
                        action: "toggle_show",
                        showId: show.id,
                        isOpen: show.is_open !== 1,
                      })
                    }
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold border transition-colors ${
                      show.is_open
                        ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border-[#1D3C63] bg-[#1D3C63] text-[#FCF686]"
                    }`}
                  >
                    {show.is_open ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        <span>예매 닫기</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        <span>예매 오픈하기</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#1D3C63]/16">
                  {showSessions.map((sess) => {
                    const remaining = Math.max(0, sess.max_capacity - sess.booked_count);
                    const pct =
                      sess.max_capacity > 0
                        ? Math.min(100, Math.round((sess.booked_count / sess.max_capacity) * 100))
                        : 100;
                    const isEditing = editingCapId === sess.id;

                    return (
                      <div
                        key={sess.id}
                        className="p-5 border-r border-b border-[#1D3C63]/16 bg-[#FAF9F4]/50 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="print-eyebrow text-[#1D3C63]/55">{sess.label}</div>
                            <div className="print-num text-sm font-bold text-[#1D3C63] mt-0.5">
                              {sess.date_str} {sess.time_str}
                            </div>
                          </div>
                          {!isEditing ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCapId(sess.id);
                                setEditingCapVal(String(sess.max_capacity));
                              }}
                              className="p-1.5 hover:bg-white text-[#1D3C63]/55 hover:text-[#1D3C63]"
                              title="최대 수량 수정"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={0}
                                max={5000}
                                value={editingCapVal}
                                onChange={(e) => setEditingCapVal(e.target.value)}
                                className="w-16 px-2 py-1 text-xs border border-[#1D3C63] bg-white print-num"
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  await patchAdmin({
                                    action: "update_capacity",
                                    sessionId: sess.id,
                                    maxCapacity: Number(editingCapVal),
                                  });
                                  setEditingCapId(null);
                                }}
                                className="p-1.5 bg-[#1D3C63] text-[#FCF686]"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 border-t border-l border-[#1D3C63]/14 bg-white text-center">
                          <div className="p-2.5 border-r border-b border-[#1D3C63]/14">
                            <div className="text-[10px] text-[#1D3C63]/55">최대</div>
                            <div className="print-num text-base font-bold text-[#1D3C63]">
                              {sess.max_capacity}
                            </div>
                          </div>
                          <div className="p-2.5 border-r border-b border-[#1D3C63]/14">
                            <div className="text-[10px] text-[#1D3C63]/55">예매</div>
                            <div className="print-num text-base font-bold text-[#1D3C63]">
                              {sess.booked_count}
                            </div>
                          </div>
                          <div
                            className={`p-2.5 border-r border-b border-[#1D3C63]/14 ${
                              remaining === 0 ? "bg-red-50" : "bg-[#FCF686]/45"
                            }`}
                          >
                            <div className="text-[10px] text-[#1D3C63]/65">잔여</div>
                            <div
                              className={`print-num text-base font-bold ${
                                remaining === 0 ? "text-red-700" : "text-[#1D3C63]"
                              }`}
                            >
                              {remaining}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="h-1.5 bg-[#1D3C63]/12 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                pct >= 100 ? "bg-red-600" : "bg-[#1D3C63]"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-[#1D3C63]/60 print-num">
                            <span>예매율 {pct}%</span>
                            <span>현장 수령 {sess.checked_in_count}매</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reservation Table */}
        <div className="bg-white border border-[#1D3C63]/16 p-6 sm:p-7 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1D3C63]">
            <h2 className="text-lg font-bold text-[#1D3C63]">
              예매자 명단 <span className="print-num text-sm text-[#1D3C63]/55">({filteredReservations.length})</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#1D3C63]/45 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="성함 / 뒷자리 / 예매번호"
                  className="pl-8 pr-3 py-2 border border-[#1D3C63]/20 text-xs w-56 focus:outline-none focus:border-[#1D3C63]"
                />
              </div>

              <select
                value={filterShow}
                onChange={(e) => {
                  setFilterShow(e.target.value);
                  setFilterSession("all");
                }}
                className="px-3 py-2 border border-[#1D3C63]/20 text-xs bg-white"
              >
                <option value="all">전체 공연</option>
                {shows.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>

              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value)}
                className="px-3 py-2 border border-[#1D3C63]/20 text-xs bg-white"
              >
                <option value="all">전체 회차</option>
                {sessions
                  .filter((s) => filterShow === "all" || s.show_id === filterShow)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.show_id === "dinoz" ? "다이노즈" : "세모끝"}] {s.label} ({s.date_str} {s.time_str})
                    </option>
                  ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#1D3C63]/20 text-xs bg-white"
              >
                <option value="confirmed">예매 확정만</option>
                <option value="all">전체 상태</option>
                <option value="cancelled">취소만</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#1D3C63]/20 text-[#1D3C63]/55 text-xs">
                  <th className="py-3 px-3 font-semibold">예매번호</th>
                  <th className="py-3 px-3 font-semibold">공연 / 회차</th>
                  <th className="py-3 px-3 font-semibold">예매자</th>
                  <th className="py-3 px-3 font-semibold">연락처</th>
                  <th className="py-3 px-3 font-semibold">상태</th>
                  <th className="py-3 px-3 font-semibold">현장 수령</th>
                  <th className="py-3 px-3 font-semibold text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D3C63]/10">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#1D3C63]/45">
                      조건에 해당하는 예매 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAF9F4]">
                      <td className="py-3 px-3 print-num font-bold text-[#1D3C63]">
                        {r.booking_code}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#1D3C63]">
                          {r.show_id === "dinoz" ? "<다이노즈>" : "<세모끝>"} {r.session_label}
                        </div>
                        <div className="print-num text-xs text-[#1D3C63]/55">
                          {r.date_str} {r.time_str}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#1D3C63]">{r.name}</td>
                      <td className="py-3 px-3 print-num text-xs">
                        {r.phone}{" "}
                        <span className="ml-1 px-1.5 py-0.5 bg-[#FCF686] text-[#1D3C63] font-bold">
                          {r.phone_last4}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-bold ${
                            r.status === "confirmed"
                              ? "bg-[#C5DB9B]/55 text-[#1D3C63]"
                              : "bg-neutral-200 text-neutral-500"
                          }`}
                        >
                          {r.status === "confirmed" ? "확정" : "취소"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {r.status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() =>
                              patchAdmin({
                                action: "toggle_checkin",
                                id: r.id,
                                checkedIn: r.checked_in !== 1,
                              })
                            }
                            className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
                              r.checked_in
                                ? "bg-[#1D3C63] border-[#1D3C63] text-[#FCF686]"
                                : "bg-white border-[#1D3C63]/30 hover:border-[#1D3C63] text-[#1D3C63]"
                            }`}
                          >
                            {r.checked_in ? "✓ 수령 완료" : "수령 체크"}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            patchAdmin({
                              action: "set_status",
                              id: r.id,
                              status: r.status === "confirmed" ? "cancelled" : "confirmed",
                            })
                          }
                          className={`text-xs font-bold hover:underline ${
                            r.status === "confirmed" ? "text-red-600" : "text-[#1D3C63]"
                          }`}
                        >
                          {r.status === "confirmed" ? "예매 취소" : "복원"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
