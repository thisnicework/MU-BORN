import { Link } from "react-router-dom";
import { Instagram, Lock, ArrowUpRight } from "lucide-react";
import { LOGOS } from "@/data/logos";

export default function Footer() {
  return (
    <footer className="bg-[#1D3C63] text-white/80 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/15">
          {/* Colophon Brand */}
          <div className="md:col-span-5 space-y-5">
            <img
              src={LOGOS.mubornBlackWhiteOutline}
              alt="MU:BORN"
              className="h-7 w-auto object-contain"
            />
            <p className="text-[13.5px] text-white/70 leading-[1.8] max-w-sm">
              서울예술대학교 학사학위 창작뮤지컬 개발 과정 MU:BORN.
              <br />
              How many possibilities can we find?
            </p>
            <a
              href="https://www.instagram.com/sia.bfa.muborn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FCF686] text-[#1D3C63] text-xs font-bold tracking-wide hover:bg-white transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@sia.bfa.muborn</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Editorial Index */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="print-eyebrow text-[#FCF686]">INDEX</h3>
            <ul className="space-y-2.5 text-[13.5px]">
              {[
                ["/muborn", "MU:BORN 소개 · 히스토리"],
                ["/works/dinoz", "창작뮤지컬 <다이노즈>"],
                ["/works/semokkeut", "창작뮤지컬 <세상 모든 이야기의 끝>"],
                ["/tickets", "티켓 예매 · 조회"],
                ["/creative-team", "CREATIVE TEAM"],
                ["/photobooth", "포토이즘 프레임"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-[#FCF686] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Program Schedule */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="print-eyebrow text-[#FCF686]">2026 SCHEDULE</h3>
            <div className="divide-y divide-white/15 border-y border-white/15 text-[13px]">
              <div className="py-3.5 space-y-1">
                <div className="font-bold text-white">01. 창작뮤지컬 &lt;다이노즈&gt;</div>
                <div className="print-num text-white/80">
                  2026.12.05(SAT) 19:00 · 12.06(SUN) 14:00 / 18:00
                </div>
                <div className="text-xs text-[#8DB4E2]">남산 드라마센터 · 러닝타임 약 90분</div>
              </div>
              <div className="py-3.5 space-y-1">
                <div className="font-bold text-white">
                  02. 창작뮤지컬 &lt;세상 모든 이야기의 끝&gt;
                </div>
                <div className="print-num text-white/80">
                  2026.12.19(SAT) 19:00 · 12.20(SUN) 14:00 / 18:00
                </div>
                <div className="text-xs text-[#C5DB9B]">
                  서울예술대학교 빨간대문 · 러닝타임 약 90분
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11.5px] text-white/45 print-num">
          <div>© 2026 SEOUL INSTITUTE OF THE ARTS · MU:BORN.</div>
          <div className="flex items-center gap-5">
            <span>INQUIRY · @sia.bfa.muborn</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>ADMIN</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
