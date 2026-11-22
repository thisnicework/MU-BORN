import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Instagram, ArrowUpRight } from "lucide-react";
import { LOGOS } from "@/data/logos";

const NAV_ITEMS = [
  { href: "/", label: "MAIN" },
  { href: "/muborn", label: "MU:BORN" },
  { href: "/works/dinoz", label: "다이노즈" },
  { href: "/works/semokkeut", label: "세상 모든 이야기의 끝" },
  { href: "/creative-team", label: "CREATIVE TEAM" },
  { href: "/guide", label: "GUIDE" },
  { href: "/photobooth", label: "뮤본네컷" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isDark = pathname === "/works/dinoz";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b ${
        isDark
          ? "bg-[#112442]/95 backdrop-blur-md border-white/15 text-white"
          : "bg-[#FAF9F4]/95 backdrop-blur-md border-[#1D3C63]/16 text-[#1D3C63]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[68px] flex items-center justify-between gap-4">
        {/* Masthead Brand */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={isDark ? LOGOS.mubornBlackWhiteOutline : LOGOS.mubornBlackLine}
            alt="MU:BORN"
            className="h-5 md:h-6 w-auto object-contain"
          />
        </Link>

        {/* Swiss Editorial Underline Navigation */}
        <nav className="hidden lg:flex items-center h-full gap-6">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative h-full inline-flex items-center text-[13px] tracking-[-0.015em] transition-colors whitespace-nowrap ${
                  active
                    ? isDark
                      ? "text-[#FCF686] font-bold"
                      : "text-[#1D3C63] font-bold"
                    : isDark
                    ? "text-white/65 hover:text-white font-medium"
                    : "text-[#1D3C63]/65 hover:text-[#1D3C63] font-medium"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                      isDark ? "bg-[#FCF686]" : "bg-[#1D3C63]"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Utility Block */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/tickets"
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-display font-bold tracking-[0.14em] uppercase transition-colors ${
              isDark
                ? "bg-[#FCF686] text-[#1D3C63] hover:bg-white"
                : "bg-[#1D3C63] text-[#FCF686] hover:bg-[#132A47]"
            }`}
          >
            <span>TICKET</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href="https://www.instagram.com/sia.bfa.muborn/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MU:BORN 공식 인스타그램"
            className={`p-2 transition-colors ${
              isDark ? "text-white/75 hover:text-[#FCF686]" : "text-[#1D3C63]/70 hover:text-[#1D3C63]"
            }`}
          >
            <Instagram className="w-[22px] h-[22px]" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴 열기"
            className={`lg:hidden p-2 ${isDark ? "text-white" : "text-[#1D3C63]"}`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Editorial Mobile Index */}
      {open && (
        <div className="lg:hidden bg-[#1D3C63] text-white border-t border-white/15">
          <div className="px-5 py-6 divide-y divide-white/10">
            {NAV_ITEMS.map((item, idx) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between py-3.5 text-sm transition-colors ${
                    active ? "text-[#FCF686] font-bold" : "text-white/85"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="print-num text-[11px] text-white/40">
                      0{idx + 1}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
            <div className="pt-5 mt-2 flex items-center justify-between">
              <a
                href="https://www.instagram.com/sia.bfa.muborn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#FCF686]"
              >
                <Instagram className="w-[18px] h-[18px]" />
                @sia.bfa.muborn
              </a>
              <Link
                to="/tickets"
                className="px-4 py-2 bg-[#FCF686] text-[#1D3C63] text-xs font-bold tracking-wider uppercase"
              >
                TICKET ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
