import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, ExternalLink } from "lucide-react";
import HeroVideo from "@/components/HeroVideo";
import { DINOZ_WORK, SEMOKKEUT_WORK, SPONSORS } from "@/data/content";
import { LOGOS } from "@/data/logos";
import {
  TapedCalendar,
  FollowArrowBadge,
  BarcodeSvg,
  SectionFolio,
} from "@/components/CuteArt";

export default function HomePage() {
  return (
    <div className="bg-[#FAF9F4] text-[#1D3C63]">
      {/* 1. Full-Bleed Trailer Cover */}
      <HeroVideo />

      {/* 2. CHAPTER 01: TICKET OPEN NOTICE (Flat MU:BORN Yellow Swiss Grid) */}
      <section className="py-20 sm:py-28 bg-[#FCF686] border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="01" title="TICKET OPEN NOTICE" meta="MU:BORN 2026 / P.01" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left 6 cols: Swiss Ruled Notice Grid */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1D3C63] print-display">
                  TICKET OPEN
                </h2>
                <p className="text-[14.5px] text-[#1D3C63]/75">
                  전석 무료 관람 · 회차당 1인 1매 (1~3회차 개별 조합 선택 가능)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#1D3C63]/20 bg-white">
                {/* ① DINOZ */}
                <Link
                  to="/tickets?show=dinoz"
                  className="group p-6 sm:p-7 border-r border-b border-[#1D3C63]/20 hover:bg-[#FAF9F4] transition-colors flex flex-col justify-between gap-7"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-[#8DB4E2]/45 text-[#1D3C63] print-eyebrow">
                        TICKET OPEN
                      </span>
                      <span className="print-num text-xs font-bold text-[#1D3C63]/40">01</span>
                    </div>
                    <img
                      src={LOGOS.dinozKrBlack}
                      alt="다이노즈"
                      className="h-7 w-auto object-contain"
                    />
                    <div className="pt-2 border-t print-rule space-y-1">
                      <div className="print-eyebrow text-[#1D3C63]/45">OPEN DATE</div>
                      <div className="print-num text-[15px] font-bold text-[#1D3C63]">
                        2026.11.22.(SUN) 20:00
                      </div>
                    </div>
                    <p className="text-[13px] text-[#1D3C63]/65 leading-[1.68] print-num">
                      12.05(SAT) 19:00 · 12.06(SUN) 14:00 / 18:00
                      <br />
                      <span className="font-sans">남산 드라마센터</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t print-rule flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D3C63]">예매 바로가기</span>
                    <FollowArrowBadge label="" />
                  </div>
                </Link>

                {/* ② SEMOKKEUT */}
                <Link
                  to="/tickets?show=semokkeut"
                  className="group p-6 sm:p-7 border-r border-b border-[#1D3C63]/20 hover:bg-[#FAF9F4] transition-colors flex flex-col justify-between gap-7"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-[#C5DB9B]/60 text-[#1D3C63] print-eyebrow">
                        COMING SOON
                      </span>
                      <span className="print-num text-xs font-bold text-[#1D3C63]/40">02</span>
                    </div>
                    <img
                      src={LOGOS.semokkeutBlack}
                      alt="세상 모든 이야기의 끝"
                      className="h-9 w-auto object-contain"
                    />
                    <div className="pt-2 border-t print-rule space-y-1">
                      <div className="print-eyebrow text-[#1D3C63]/45">OPEN DATE</div>
                      <div className="print-num text-[15px] font-bold text-[#1D3C63]">
                        2026.12.03.(THU) 20:00
                      </div>
                    </div>
                    <p className="text-[13px] text-[#1D3C63]/65 leading-[1.68] print-num">
                      12.19(SAT) 19:00 · 12.20(SUN) 14:00 / 18:00
                      <br />
                      <span className="font-sans">서울예술대학교 빨간대문</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t print-rule flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D3C63]">오픈 일정 보기</span>
                    <FollowArrowBadge label="" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right 6 cols: Swiss Editorial Interactive Calendar */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <TapedCalendar />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHAPTER 02: 2026 MU:BORN LINE UP (Program Book Plates + Hairline Spec Tables) */}
      <section id="lineup" className="py-24 sm:py-32 bg-[#FAF9F4] border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <SectionFolio index="02" title="2026 MU:BORN LINE UP" meta="TWO ORIGINAL MUSICALS / P.02" />

          <div className="space-y-28">
            {/* Plate 01: DINOZ */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
              <div className="md:col-span-5">
                <Link to="/works/dinoz" className="block group">
                  <div className="overflow-hidden bg-[#0B1729] border border-[#1D3C63]/15">
                    <img
                      src={DINOZ_WORK.poster}
                      alt="창작뮤지컬 <다이노즈> 포스터"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="pt-2.5 flex items-center justify-between text-[11px] text-[#1D3C63]/50 print-num">
                    <span>PLATE 01 — DINOZ OFFICIAL POSTER</span>
                    <span>12.05 – 12.06</span>
                  </div>
                </Link>
              </div>

              <div className="md:col-span-7 space-y-8 md:pt-2">
                <div className="flex items-center justify-between border-b border-[#1D3C63] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#1D3C63] text-[#FCF686] print-num text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="print-eyebrow text-[#1D3C63]">ALIEN IDOL MUSICAL</span>
                  </div>
                  <span className="print-eyebrow text-[#1D3C63]/45">NAMSAN DRAMA CENTER</span>
                </div>

                <div className="flex items-end gap-4 flex-wrap">
                  <img
                    src={LOGOS.dinozKrBlack}
                    alt="다이노즈"
                    className="h-11 sm:h-14 w-auto object-contain"
                  />
                  <img
                    src={LOGOS.dinozEnBlack}
                    alt="DINOZ"
                    className="h-7 sm:h-8 w-auto object-contain opacity-65"
                  />
                </div>

                {/* Swiss Ruled Spec Table */}
                <dl className="divide-y divide-[#1D3C63]/16 border-y border-[#1D3C63]/16 text-[14.5px]">
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      공연명
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-bold text-[#1D3C63]">
                      {DINOZ_WORK.info.공연명}
                    </dd>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      공연일시
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63] print-num space-y-0.5 leading-[1.6]">
                      {DINOZ_WORK.info.공연일시.map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </dd>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      러닝타임
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63]">
                      {DINOZ_WORK.info.러닝타임}
                    </dd>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      공연장소
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63]">
                      {DINOZ_WORK.info.공연장소}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap gap-2.5">
                    <Link
                      to="/works/dinoz"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] text-sm font-bold transition-colors"
                    >
                      <span>작품 상세 보기</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/tickets?show=dinoz"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-[#1D3C63] hover:bg-[#FCF686] text-[#1D3C63] text-sm font-bold transition-colors"
                    >
                      <span>티켓 예매</span>
                    </Link>
                  </div>
                  <BarcodeSvg className="h-5 w-24 text-[#1D3C63]/40 hidden sm:block" />
                </div>
              </div>
            </div>

            {/* Plate 02: SEMOKKEUT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start pt-8 border-t border-[#1D3C63]/16">
              <div className="md:col-span-7 order-2 md:order-1 space-y-8 md:pt-2">
                <div className="flex items-center justify-between border-b border-[#1D3C63] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#1D3C63] text-[#FCF686] print-num text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="print-eyebrow text-[#1D3C63]">STORYBOOK MUSICAL</span>
                  </div>
                  <span className="print-eyebrow text-[#1D3C63]/45">SIA RED GATE</span>
                </div>

                <img
                  src={LOGOS.semokkeutBlack}
                  alt="세상 모든 이야기의 끝"
                  className="h-16 sm:h-20 w-auto object-contain"
                />

                <dl className="divide-y divide-[#1D3C63]/16 border-y border-[#1D3C63]/16 text-[14.5px]">
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      공연명
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-bold text-[#1D3C63]">
                      {SEMOKKEUT_WORK.info.공연명}
                    </dd>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      공연일시
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63] print-num space-y-0.5 leading-[1.6]">
                      {SEMOKKEUT_WORK.info.공연일시.map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </dd>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      러닝타임
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63]">
                      {SEMOKKEUT_WORK.info.러닝타임}
                    </dd>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                      공연장소
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63]">
                      {SEMOKKEUT_WORK.info.공연장소}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap gap-2.5">
                    <Link
                      to="/works/semokkeut"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] text-sm font-bold transition-colors"
                    >
                      <span>작품 상세 보기</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/tickets?show=semokkeut"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-[#1D3C63] hover:bg-[#FCF686] text-[#1D3C63] text-sm font-bold transition-colors"
                    >
                      <span>12.03 오픈 일정</span>
                    </Link>
                  </div>
                  <BarcodeSvg className="h-5 w-24 text-[#1D3C63]/40 hidden sm:block" />
                </div>
              </div>

              <div className="md:col-span-5 order-1 md:order-2">
                <Link to="/works/semokkeut" className="block group">
                  <div className="overflow-hidden bg-[#241B14] border border-[#1D3C63]/15">
                    <img
                      src={SEMOKKEUT_WORK.poster}
                      alt="창작뮤지컬 <세상 모든 이야기의 끝> 포스터"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="pt-2.5 flex items-center justify-between text-[11px] text-[#1D3C63]/50 print-num">
                    <span>PLATE 02 — SEMOKKEUT OFFICIAL POSTER</span>
                    <span>12.19 – 12.20</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHAPTER 03: PHOTOISM SPECIAL BAND */}
      <section className="py-16 sm:py-20 bg-[#1D3C63] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionFolio index="03" title="SPECIAL EDITION · PHOTOISM" meta="4-CUT FRAME" dark />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#FCF686]">
                배우 프로필과 함께 찍는 4컷 포토이즘 프레임
              </h2>
              <p className="text-[14.5px] text-white/75 print-measure leading-[1.8]">
                &lt;다이노즈&gt;, &lt;세상 모든 이야기의 끝&gt;, MU:BORN 2026 시그니처 프레임으로 웹캠 촬영 또는 사진 업로드를 통해 나만의 4컷 이미지를 바로 저장하실 수 있습니다.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                to="/photobooth"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FCF686] hover:bg-white text-[#1D3C63] font-bold text-sm transition-colors"
              >
                <span>포토이즘 프레임 만들기</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHAPTER 04: OFFICIAL SPONSORS + INSTAGRAM */}
      <section className="py-24 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <SectionFolio index="04" title="OFFICIAL SPONSORS" meta="PARTNERS / P.04" />

          <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-l border-[#1D3C63]/16">
            {SPONSORS.map((sp) => (
              <div
                key={sp.id}
                className="p-7 sm:p-10 border-r border-b border-[#1D3C63]/16 bg-[#FAF9F4]/60 flex flex-col justify-between gap-7"
              >
                <div className="flex items-center justify-between gap-4 pb-5 border-b print-rule">
                  <img src={sp.logo} alt={sp.name} className="h-8 sm:h-9 w-auto object-contain" />
                  <span className="text-xs font-medium text-[#1D3C63]/55">{sp.slogan}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                  <div className="sm:col-span-5">
                    <img
                      src={sp.productImage}
                      alt={sp.productName}
                      className="w-full aspect-square object-cover bg-white border border-[#1D3C63]/10"
                    />
                  </div>
                  <div className="sm:col-span-7 space-y-3">
                    <h3 className="text-[15.5px] font-bold text-[#1D3C63] leading-[1.4]">
                      {sp.productName}
                    </h3>
                    {"productSlogan" in sp && sp.productSlogan && (
                      <p className="text-[13px] font-semibold text-[#1D3C63]/80">
                        {sp.productSlogan}
                      </p>
                    )}
                    <div className="space-y-2 text-[13.5px] text-[#1D3C63]/75 leading-[1.8]">
                      {sp.description.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                    {"website" in sp && sp.website && (
                      <a
                        href={sp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1D3C63] hover:underline pt-1"
                      >
                        <span>공식 홈페이지</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial Instagram Strip */}
          <div className="bg-[#FCF686] p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#1D3C63] text-[#FCF686] flex items-center justify-center shrink-0">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <div className="print-eyebrow text-[#1D3C63]/55">OFFICIAL CHANNEL</div>
                <div className="font-display font-bold text-lg text-[#1D3C63]">@sia.bfa.muborn</div>
              </div>
            </div>
            <a
              href="https://www.instagram.com/sia.bfa.muborn/"
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0"
            >
              <FollowArrowBadge label="Follow the arrow" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
