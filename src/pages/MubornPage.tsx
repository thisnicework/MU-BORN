import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import {
  MUBORN_ABOUT,
  MUBORN_INTENT,
  DINOZ_WORK,
  SEMOKKEUT_WORK,
} from "@/data/content";
import { LOGOS } from "@/data/logos";
import mediaManifest from "@/data/media-manifest.json";
import {
  SectionFolio,
  ClawGripper,
  JoystickObjet,
  DarkCornerScene,
} from "@/components/CuteArt";

interface LightboxItem {
  year: number | string;
  title: string;
  image: string;
}

export default function MubornPage() {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);

  return (
    <div className="pt-16 md:pt-[68px] bg-[#FAF9F4] text-[#1D3C63]">
      {/* Masthead Band */}
      <section className="bg-[#FCF686] py-16 sm:py-24 border-b border-[#1D3C63]/16 relative overflow-hidden">
        {/* Subtle Claw Machine architectural silhouette in right negative space */}
        <div className="hidden lg:block absolute top-0 right-[11%] pointer-events-none opacity-90">
          <ClawGripper className="w-16 h-20" />
        </div>
        <div className="hidden lg:block absolute bottom-0 right-[8%] pointer-events-none">
          <JoystickObjet className="w-40 h-16" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
          <SectionFolio index="00" title="ABOUT MU:BORN" meta="SEOUL INSTITUTE OF THE ARTS" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-6">
              <img
                src={LOGOS.mubornBlackLine}
                alt="MU:BORN"
                className="h-9 sm:h-11 w-auto object-contain"
              />
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1D3C63] print-display">
                뮤지컬의 탄생(BORN),
                <br />
                뮤지컬의 근본(本)
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right lg:pb-12 space-y-1 text-xs text-[#1D3C63]/70">
              <div className="print-eyebrow">CREATIVE MUSICAL PLATFORM</div>
              <div className="print-num font-semibold">2016 — 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* 01. Introduction (4 : 8 Swiss Editorial Grid) */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="01" title="OVERVIEW" meta="MUSICAL LAB" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4 space-y-2">
              <h2 className="font-display text-3xl font-bold text-[#1D3C63]">
                {MUBORN_ABOUT.title}
              </h2>
              <p className="text-xs text-[#1D3C63]/55 leading-relaxed">
                서울예술대학교 학사학위
                <br />
                창작뮤지컬 개발 과정
              </p>
            </div>
            <div className="md:col-span-8 print-measure print-body text-[#1D3C63]/85 space-y-5">
              {MUBORN_ABOUT.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02. 2026 MU:BORN LINE UP */}
      <section className="py-20 sm:py-28 bg-[#FAF9F4] border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="02" title="2026 MU:BORN LINE UP" meta="2 ORIGINAL WORKS" />

          <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#1D3C63]/16 bg-white">
            <Link
              to="/works/dinoz"
              className="group p-6 sm:p-9 border-r border-b border-[#1D3C63]/16 hover:bg-[#FAF9F4]/60 transition-colors space-y-6"
            >
              <div className="overflow-hidden aspect-[3/4] bg-[#0B1729] border border-[#1D3C63]/10">
                <img
                  src={DINOZ_WORK.poster}
                  alt="창작뮤지컬 <다이노즈> 포스터"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex items-end justify-between gap-4 pt-2 border-t print-rule">
                <div className="space-y-1.5">
                  <div className="print-num text-xs text-[#1D3C63]/55">
                    2026.12.05 – 12.06 · 남산 드라마센터
                  </div>
                  <img
                    src={LOGOS.dinozKrBlack}
                    alt="다이노즈"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#1D3C63] shrink-0" />
              </div>
            </Link>

            <Link
              to="/works/semokkeut"
              className="group p-6 sm:p-9 border-r border-b border-[#1D3C63]/16 hover:bg-[#FAF9F4]/60 transition-colors space-y-6"
            >
              <div className="overflow-hidden aspect-[3/4] bg-[#241B14] border border-[#1D3C63]/10">
                <img
                  src={SEMOKKEUT_WORK.poster}
                  alt="창작뮤지컬 <세상 모든 이야기의 끝> 포스터"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex items-end justify-between gap-4 pt-2 border-t print-rule">
                <div className="space-y-1.5">
                  <div className="print-num text-xs text-[#1D3C63]/55">
                    2026.12.19 – 12.20 · 서울예술대학교 빨간대문
                  </div>
                  <img
                    src={LOGOS.semokkeutBlack}
                    alt="세상 모든 이야기의 끝"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#1D3C63] shrink-0" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 03. 2026 MU:BORN 기획의도 */}
      <section className="py-20 sm:py-28 bg-[#1D3C63] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="03" title={MUBORN_INTENT.sectionTitle} meta="CURATORIAL NOTE" dark />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 flex flex-col justify-between gap-10">
              <blockquote className="text-2xl sm:text-3xl font-bold leading-[1.35] text-[#FCF686]">
                “{MUBORN_INTENT.headline}”
              </blockquote>
              <div className="hidden lg:block pt-4">
                <DarkCornerScene className="w-56 h-40 opacity-95" />
              </div>
            </div>
            <div className="lg:col-span-7 print-measure print-body text-white/85 space-y-5 lg:border-l lg:border-white/15 lg:pl-10">
              {MUBORN_INTENT.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04. MU:BORN HISTORY (2016 - 2026) — Crisp Sharp Plate Archive matching image1.png! */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <SectionFolio index="04" title="MU:BORN HISTORY" meta="ARCHIVE 2016 – 2026" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-7 gap-y-12">
            {mediaManifest.history.map((item) => (
              <button
                key={item.year}
                type="button"
                onClick={() => setLightbox(item)}
                className="group text-left focus:outline-none"
              >
                <div className="aspect-[3/4.2] w-full overflow-hidden bg-neutral-100 border border-[#1D3C63]/12">
                  <img
                    src={item.image}
                    alt={`${item.year} ${item.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#1D3C63]/15 space-y-0.5">
                  <div className="print-num text-xs font-bold text-[#1D3C63]/55">{item.year}</div>
                  <div className="text-[13.5px] font-bold text-[#1D3C63] leading-[1.45]">
                    {item.title}
                  </div>
                </div>
              </button>
            ))}

            {/* 2026 Dual Entry */}
            <div className="col-span-2 grid grid-cols-2 gap-5 p-5 bg-[#FCF686]/55 border border-[#1D3C63]/16">
              <Link to="/works/dinoz" className="group text-left">
                <div className="aspect-[3/4.2] overflow-hidden bg-[#0B1729] border border-[#1D3C63]/15">
                  <img
                    src={DINOZ_WORK.poster}
                    alt="2026 다이노즈"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#1D3C63]/20 space-y-0.5">
                  <div className="print-num text-xs font-bold text-[#1D3C63]/60">2026</div>
                  <div className="text-[13.5px] font-bold text-[#1D3C63]">다이노즈</div>
                </div>
              </Link>
              <Link to="/works/semokkeut" className="group text-left">
                <div className="aspect-[3/4.2] overflow-hidden bg-[#241B14] border border-[#1D3C63]/15">
                  <img
                    src={SEMOKKEUT_WORK.poster}
                    alt="2026 세상 모든 이야기의 끝"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#1D3C63]/20 space-y-0.5">
                  <div className="print-num text-xs font-bold text-[#1D3C63]/60">2026</div>
                  <div className="text-[13.5px] font-bold text-[#1D3C63] leading-[1.4]">
                    세상 모든 이야기의 끝
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-end">
            <div className="hidden sm:block w-52 h-14 mr-20 pointer-events-none">
              <svg viewBox="0 0 220 60" className="w-full h-full stroke-[#1D3C63]/35" fill="none">
                <path d="M 0 5 L 150 5 L 185 58" strokeWidth="1.25" />
              </svg>
            </div>
            <div className="px-7 py-2.5 rounded-full bg-[#1D3C63] text-[#FCF686] print-eyebrow">
              MU:BORN HISTORY
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/82 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-md w-full bg-white border border-[#1D3C63]/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightbox.image}
              alt={lightbox.title}
              className="w-full h-auto max-h-[75vh] object-contain bg-neutral-900"
            />
            <div className="p-5 flex items-center justify-between border-t print-rule">
              <span className="print-num text-xs font-bold text-[#1D3C63]/55">
                {lightbox.year} MU:BORN
              </span>
              <span className="text-base font-bold text-[#1D3C63]">{lightbox.title}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
