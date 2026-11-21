import { Link } from "react-router-dom";
import { ExternalLink, Instagram, ArrowUpRight } from "lucide-react";
import {
  AUDIENCE_GUIDE,
  TICKET_RECEIPT_GUIDE,
  ONSITE_TICKET_GUIDE,
  VENUES,
  SPONSORS,
} from "@/data/content";
import {
  ClawGripper,
  SectionFolio,
  DarkCornerScene,
} from "@/components/CuteArt";

export default function GuidePage() {
  return (
    <div className="pt-16 md:pt-[68px] bg-[#FAF9F4] min-h-screen text-[#1D3C63]">
      {/* Masthead Band */}
      <section className="bg-[#FCF686] py-14 sm:py-20 border-b border-[#1D3C63]/16 relative overflow-hidden">
        <div className="hidden md:block absolute top-0 right-16 pointer-events-none opacity-90">
          <ClawGripper className="w-16 h-20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
          <SectionFolio index="00" title="AUDIENCE GUIDE" meta="MU:BORN 2026 / INFO" />
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1D3C63] print-display">
              관람 및 티켓 수령 안내
            </h1>
            <p className="text-sm text-[#1D3C63]/75">
              원활한 공연 관람을 위해 방문 전 아래 안내 사항을 확인해 주세요.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* 01. Three-Column Swiss Ruled Guide Grid */}
          <div className="space-y-8">
            <SectionFolio index="01" title="REGULATIONS & TICKETING" meta="3 SECTIONS" />

            <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-l border-[#1D3C63]/18">
              {/* Audience Guide */}
              <div className="bg-white p-7 sm:p-9 border-r border-b border-[#1D3C63]/18 space-y-6">
                <div className="pb-4 border-b border-[#1D3C63] flex items-baseline justify-between">
                  <div>
                    <span className="print-eyebrow text-[#1D3C63]/45 block">01</span>
                    <h2 className="font-display text-lg font-bold text-[#1D3C63] mt-0.5">
                      Audience Guide
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-[#1D3C63]/55">관람 유의사항</span>
                </div>
                <ul className="space-y-3 text-[14px] text-[#1D3C63]/85 leading-[1.8]">
                  {AUDIENCE_GUIDE.map((item, idx) => (
                    <li key={idx} className="grid grid-cols-[14px_1fr] gap-1.5">
                      <span className="font-bold text-[#1D3C63]/40">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ticket Receipt */}
              <div className="bg-[#FCF686]/55 p-7 sm:p-9 border-r border-b border-[#1D3C63]/18 space-y-6">
                <div className="pb-4 border-b border-[#1D3C63] flex items-baseline justify-between">
                  <div>
                    <span className="print-eyebrow text-[#1D3C63]/50 block">02</span>
                    <h2 className="font-display text-lg font-bold text-[#1D3C63] mt-0.5">
                      Ticket Receipt
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-[#1D3C63]/65">티켓 수령 안내</span>
                </div>
                <ul className="space-y-3 text-[14px] text-[#1D3C63]/90 leading-[1.8]">
                  {TICKET_RECEIPT_GUIDE.map((item, idx) => (
                    <li key={idx} className="grid grid-cols-[14px_1fr] gap-1.5">
                      <span className="font-bold text-[#1D3C63]/50">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* On-site Ticket */}
              <div className="bg-[#1D3C63] text-white p-7 sm:p-9 pb-36 sm:pb-40 border-r border-b border-[#1D3C63] relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                  <div className="pb-4 border-b border-white/25 flex items-baseline justify-between">
                    <div>
                      <span className="print-eyebrow text-[#FCF686]/75 block">03</span>
                      <h2 className="font-display text-lg font-bold text-[#FCF686] mt-0.5">
                        On-site Ticket
                      </h2>
                    </div>
                    <span className="text-xs font-medium text-white/65">현장 예매 안내</span>
                  </div>
                  <ul className="space-y-3 text-[14px] text-white/85 leading-[1.8]">
                    {ONSITE_TICKET_GUIDE.map((item, idx) => (
                      <li key={idx} className="grid grid-cols-[14px_1fr] gap-1.5">
                        <span className="font-bold text-[#FCF686]/70">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Organic Card-2 corner vignette tucked into bottom-right negative space */}
                <div className="absolute -bottom-2 right-2 pointer-events-none opacity-95">
                  <DarkCornerScene className="w-48 h-34" />
                </div>
              </div>
            </div>
          </div>

          {/* 02. Venues */}
          <div className="space-y-8">
            <SectionFolio index="02" title="VENUES & DIRECTIONS" meta="MAP" />

            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#1D3C63]/16 bg-white">
              {VENUES.map((v, idx) => (
                <div
                  key={v.name}
                  className="p-7 sm:p-9 border-r border-b border-[#1D3C63]/16 flex flex-col justify-between gap-6"
                >
                  <div className="space-y-3">
                    <span
                      className="inline-block px-2.5 py-0.5 text-xs font-bold text-[#1D3C63]"
                      style={{ backgroundColor: idx === 0 ? "#8DB4E2" : "#C5DB9B" }}
                    >
                      {v.show}
                    </span>
                    <h3 className="text-2xl font-bold text-[#1D3C63]">{v.name}</h3>
                    <p className="text-sm text-[#1D3C63]/75">{v.address}</p>
                    <p className="print-num text-xs text-[#1D3C63]/55">{v.dates}</p>
                  </div>
                  <a
                    href={v.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D3C63] hover:underline pt-4 border-t print-rule"
                  >
                    <span>네이버 지도에서 위치 보기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* 03. Sponsors */}
          <div className="space-y-8">
            <SectionFolio index="03" title="OFFICIAL SPONSORS" meta="PARTNERS" />

            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#1D3C63]/16 bg-white">
              {SPONSORS.map((sp) => (
                <div
                  key={sp.id}
                  className="p-6 sm:p-8 border-r border-b border-[#1D3C63]/16 flex items-center gap-5"
                >
                  <img
                    src={sp.productImage}
                    alt={sp.productName}
                    className="w-20 h-20 object-cover border border-[#1D3C63]/12 shrink-0"
                  />
                  <div className="space-y-1">
                    <img src={sp.logo} alt={sp.name} className="h-7 w-auto object-contain" />
                    <div className="text-sm font-bold text-[#1D3C63]">{sp.productName}</div>
                    <p className="text-xs text-[#1D3C63]/65">{sp.slogan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inquiry Footer Strip */}
          <div className="bg-[#1D3C63] text-white p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="print-eyebrow text-[#FCF686]">INQUIRY</div>
              <div className="font-bold text-lg">추가 문의사항이 있으신가요?</div>
              <p className="text-xs sm:text-sm text-white/75">
                공식 인스타그램(@sia.bfa.muborn) DM으로 문의해 주세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/tickets"
                className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#FCF686] text-[#1D3C63] font-bold text-xs tracking-wider uppercase"
              >
                <span>티켓 예매</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://www.instagram.com/sia.bfa.muborn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/30 hover:bg-white/10 text-white font-semibold text-xs"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@sia.bfa.muborn</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
