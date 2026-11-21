import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import mediaManifest from "@/data/media-manifest.json";
import { DINOZ_WORK, SEMOKKEUT_WORK } from "@/data/content";
import { LOGOS } from "@/data/logos";
import { SectionFolio } from "@/components/CuteArt";

type TabKey = "dinoz" | "semokkeut" | "credits";

interface TeamMember {
  order: number;
  role: string;
  name: string;
  image: string;
}

const DEPT_FILTERS = [
  { key: "ALL", label: "전체" },
  { key: "기획", label: "기획" },
  { key: "창작", label: "작가·작곡·연출" },
  { key: "음악안무", label: "음악·안무" },
  { key: "무대기술", label: "무대·조명·음향·영상" },
  { key: "비주얼", label: "의상·분장·사진·디자인·SW" },
  { key: "홍보영상", label: "홍보영상" },
  { key: "세션", label: "세션" },
  { key: "지도교수", label: "지도교수" },
];

function matchDept(role: string, filterKey: string): boolean {
  if (filterKey === "ALL") return true;
  if (filterKey === "기획") return role.includes("기획");
  if (filterKey === "창작")
    return role.includes("작") || role.includes("연출") || role.includes("드라마터그");
  if (filterKey === "음악안무")
    return role.includes("음악") || role.includes("편곡") || role.includes("안무");
  if (filterKey === "무대기술")
    return (
      role.includes("무대") ||
      role.includes("조명") ||
      role.includes("음향") ||
      role.includes("영상오퍼") ||
      role.includes("레이저")
    );
  if (filterKey === "비주얼")
    return (
      role.includes("의상") ||
      role.includes("분장") ||
      role.includes("사진") ||
      role.includes("디자인") ||
      role.includes("소프트웨어")
    );
  if (filterKey === "홍보영상") return role.includes("홍보영상");
  if (filterKey === "세션") return role.includes("세션");
  if (filterKey === "지도교수") return role.includes("지도교수");
  return true;
}

export default function CreativeTeamPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) || "dinoz";
  const [tab, setTab] = useState<TabKey>(
    ["dinoz", "semokkeut", "credits"].includes(initialTab) ? initialTab : "dinoz"
  );
  const [dept, setDept] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<TeamMember | null>(null);

  const switchTab = (next: TabKey) => {
    setTab(next);
    setDept("ALL");
    setQuery("");
    setSearchParams({ tab: next }, { replace: true });
  };

  const list: TeamMember[] =
    tab === "dinoz" ? mediaManifest.dinozCreative : mediaManifest.semokkeutCreative;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((m) => {
      if (!matchDept(m.role, dept)) return false;
      if (!q) return true;
      return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q);
    });
  }, [list, dept, query]);

  return (
    <div className="pt-16 md:pt-[68px] min-h-screen bg-[#FAF9F4] text-[#1D3C63]">
      {/* Program Book Cover */}
      <section className="bg-[#1D3C63] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-8">
          <SectionFolio index="00" title="CREDITS & STAFF" meta="MU:BORN @2026" dark />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-2xl sm:text-3xl font-light text-white/85">
                <span>(</span>
                <img
                  src={LOGOS.mubornBlackWhiteOutline}
                  alt="MU:BORN"
                  className="h-8 sm:h-10 w-auto object-contain"
                />
                <span>)</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
                CREATIVE TEAM
              </h1>
            </div>
            <div className="print-num text-2xl sm:text-3xl font-bold text-[#FCF686]">@2026</div>
          </div>
        </div>
      </section>

      {/* Editorial Underline Tab Bar */}
      <div className="sticky top-16 md:top-[68px] z-30 bg-white/95 backdrop-blur-md border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {[
              { key: "dinoz" as TabKey, label: `다이노즈 (${mediaManifest.dinozCreative.length})` },
              {
                key: "semokkeut" as TabKey,
                label: `세상 모든 이야기의 끝 (${mediaManifest.semokkeutCreative.length})`,
              },
              { key: "credits" as TabKey, label: "전체 CREDIT" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => switchTab(item.key)}
                className={`relative py-4 text-xs sm:text-sm transition-colors ${
                  tab === item.key
                    ? "text-[#1D3C63] font-bold"
                    : "text-[#1D3C63]/55 hover:text-[#1D3C63] font-medium"
                }`}
              >
                {item.label}
                {tab === item.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D3C63]" />
                )}
              </button>
            ))}
          </div>

          {tab !== "credits" && (
            <div className="relative w-full sm:w-60 py-2">
              <Search className="w-3.5 h-3.5 text-[#1D3C63]/45 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="이름 또는 파트 검색"
                className="w-full pl-8 pr-3 py-1.5 border-b border-[#1D3C63]/25 bg-transparent text-xs sm:text-sm text-[#1D3C63] focus:outline-none focus:border-[#1D3C63]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {tab !== "credits" ? (
          <div className="space-y-12">
            {/* Title + Dept Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1D3C63]/16">
              <div className="space-y-2">
                <span className="print-eyebrow text-[#1D3C63]/50">CREATIVE TEAM · PROFILES</span>
                <img
                  src={tab === "dinoz" ? LOGOS.dinozKrBlack : LOGOS.semokkeutBlack}
                  alt={tab}
                  className={tab === "dinoz" ? "h-9 w-auto" : "h-13 w-auto"}
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {DEPT_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setDept(f.key)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${
                      dept === f.key
                        ? "bg-[#1D3C63] border-[#1D3C63] text-[#FCF686] font-bold"
                        : "bg-white border-[#1D3C63]/16 text-[#1D3C63]/70 hover:border-[#1D3C63]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#1D3C63]/50 text-sm">
                검색 조건에 해당하는 창작진이 없습니다.
              </div>
            ) : (
              /* Sharp Program-Book Plate Grid matching image8.png */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-7 gap-y-11">
                {filtered.map((member) => (
                  <button
                    key={`${tab}-${member.order}-${member.name}`}
                    type="button"
                    onClick={() => setSelected(member)}
                    className="group text-left focus:outline-none"
                  >
                    <div className="aspect-[4/4.6] w-full overflow-hidden bg-neutral-200 border border-[#1D3C63]/12">
                      <img
                        src={member.image}
                        alt={`${member.role} ${member.name}`}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#1D3C63]/16 flex items-baseline justify-between gap-2">
                      <span className="text-xs text-[#1D3C63]/60 font-medium truncate">
                        {member.role}
                      </span>
                      <span className="text-[15px] font-bold text-[#1D3C63] shrink-0">
                        {member.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            <div className="bg-[#4A4A4A] text-white border border-[#1D3C63]/16">
              <img
                src={DINOZ_WORK.creditImage}
                alt="창작뮤지컬 <다이노즈> 공식 크레딧"
                className="w-full h-auto"
              />
              <div className="p-7 sm:p-11 bg-[#1D3C63]">
                <h3 className="print-eyebrow text-[#FCF686] mb-6">DINOZ — FULL CREDITS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2.5 text-[13.5px] leading-[1.65]">
                  {DINOZ_WORK.credits.map((c) => (
                    <div key={c.role} className="grid grid-cols-12 gap-3 py-1.5 border-b border-white/10">
                      <span className="col-span-5 text-right font-semibold text-white/95 pr-1">
                        {c.role}
                      </span>
                      <span className="col-span-7 text-white/75">{c.names}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#4A4A4A] text-white border border-[#1D3C63]/16">
              <img
                src={SEMOKKEUT_WORK.creditImage}
                alt="창작뮤지컬 <세상 모든 이야기의 끝> 공식 크레딧"
                className="w-full h-auto"
              />
              <div className="p-7 sm:p-11 bg-[#1D3C63]">
                <h3 className="print-eyebrow text-[#FCF686] mb-6">
                  THE END OF EVERY STORY — FULL CREDITS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2.5 text-[13.5px] leading-[1.65]">
                  {SEMOKKEUT_WORK.credits.map((c) => (
                    <div key={c.role} className="grid grid-cols-12 gap-3 py-1.5 border-b border-white/10">
                      <span className="col-span-5 text-right font-semibold text-white/95 pr-1">
                        {c.role}
                      </span>
                      <span className="col-span-7 text-white/75">{c.names}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/82 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white border border-[#1D3C63]/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/4.8] bg-neutral-200">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-5 flex items-baseline justify-between border-t print-rule">
              <span className="text-xs font-semibold text-[#1D3C63]/60">{selected.role}</span>
              <span className="text-xl font-bold text-[#1D3C63]">{selected.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
