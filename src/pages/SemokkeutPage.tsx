import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Camera, X } from "lucide-react";
import { SEMOKKEUT_WORK } from "@/data/content";
import { LOGOS } from "@/data/logos";
import mediaManifest from "@/data/media-manifest.json";
import { BarcodeSvg, SectionFolio } from "@/components/CuteArt";

interface CastCardItem {
  order: number;
  role: string;
  name: string;
  image: string;
}

export default function SemokkeutPage() {
  const [selectedPerson, setSelectedPerson] = useState<CastCardItem | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#1D3C63] pt-16 md:pt-[68px]">
      {/* 01. COVER & INFORMATION */}
      <section className="py-16 sm:py-24 border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="01" title="WORK 02 · THE END OF EVERY STORY" meta="STORYBOOK MUSICAL" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <div className="w-full max-w-md mx-auto lg:mx-0 overflow-hidden bg-[#241B14] border border-[#1D3C63]/15">
                <img
                  src={SEMOKKEUT_WORK.poster}
                  alt="창작뮤지컬 <세상 모든 이야기의 끝> 포스터"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="max-w-md mx-auto lg:mx-0 pt-2.5 flex justify-between text-[11px] text-[#1D3C63]/50 print-num">
                <span>OFFICIAL POSTER</span>
                <span>2026.12.19 – 12.20</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-[#C5DB9B] text-[#1D3C63] print-eyebrow">
                  2026 MU:BORN · STORYBOOK MUSICAL
                </span>

                <img
                  src={LOGOS.semokkeutBlack}
                  alt="세상 모든 이야기의 끝"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
                <p className="font-serif text-[15px] text-[#1D3C63]/75 tracking-[-0.015em] leading-[1.75]">
                  “끝이라고 생각했던 순간, 아직 쓰이지 않은 새로운 이야기가 시작된다.”
                </p>
              </div>

              {/* Swiss Hairline Spec Table */}
              <div className="border-y border-[#1D3C63]/20 divide-y divide-[#1D3C63]/14 text-[14.5px]">
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                    공연명
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-bold text-[#1D3C63]">
                    {SEMOKKEUT_WORK.info.공연명}
                  </div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                    공연일시
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63] print-num space-y-0.5 leading-[1.65]">
                    {SEMOKKEUT_WORK.info.공연일시.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                    러닝타임
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63]">90분</div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                    공연장소
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63]">
                    {SEMOKKEUT_WORK.info.공연장소}
                  </div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-[#1D3C63]/50 pt-1">
                    지도교수
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-[#1D3C63]">
                    {SEMOKKEUT_WORK.info.지도교수}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/tickets?show=semokkeut"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] font-bold text-sm transition-colors"
                >
                  <span>티켓 오픈 일정 (12.03)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/photobooth?frame=semokkeut"
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#1D3C63] hover:bg-[#FCF686] text-[#1D3C63] font-bold text-sm transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>포토이즘 프레임</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. SYNOPSIS */}
      <section className="py-20 sm:py-28 bg-[#FCF686]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="02" title="SYNOPSIS" meta="CHAPTER I" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1D3C63]">
                Synopsis
              </h2>
              <BarcodeSvg className="h-5 w-24 text-[#1D3C63]/55" />
            </div>
            <div className="lg:col-span-8 bg-[#1D3C63] text-white p-8 sm:p-12 space-y-7">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <img
                  src={LOGOS.semokkeutWhite}
                  alt="세상 모든 이야기의 끝"
                  className="h-11 sm:h-13 w-auto object-contain"
                />
                <div className="w-4 h-4 rounded-full bg-[#FCF686]" />
              </div>
              <div className="print-measure print-serif-body text-white/90 space-y-5">
                {SEMOKKEUT_WORK.synopsis.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. ABOUT THE WORK */}
      <section className="py-20 sm:py-28 bg-[#FAF7EE] border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="03" title="ABOUT THE WORK" meta="DIRECTOR & WRITER NOTES" />

          <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-l border-[#1D3C63]/16 bg-white">
            <article className="p-8 sm:p-10 border-r border-b border-[#1D3C63]/16 space-y-6">
              <div className="border-b print-rule pb-5 space-y-1.5">
                <h2 className="font-display text-2xl sm:text-[1.75rem] font-bold text-[#1D3C63]">
                  About The Work
                </h2>
                <p className="text-[13px] font-semibold text-[#1D3C63]/60">
                  {SEMOKKEUT_WORK.directorNote.role}
                </p>
              </div>
              <div className="print-serif-body text-[#1D3C63]/85 space-y-5">
                {SEMOKKEUT_WORK.directorNote.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>

            <article className="p-8 sm:p-10 border-r border-b border-[#1D3C63]/16 space-y-6">
              <div className="border-b print-rule pb-5 space-y-1.5">
                <h2 className="font-display text-2xl sm:text-[1.75rem] font-bold text-[#1D3C63]">
                  About The Work
                </h2>
                <p className="text-[13px] font-semibold text-[#1D3C63]/60">
                  {SEMOKKEUT_WORK.writerNote.role}
                </p>
              </div>
              <div className="print-serif-body text-[#1D3C63]/85 space-y-5">
                {SEMOKKEUT_WORK.writerNote.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 04. CAST */}
      <section className="py-24 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <SectionFolio index="04" title="CAST" meta="CHARACTERS" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {mediaManifest.semokkeutCast.map((person) => (
              <button
                key={person.order}
                type="button"
                onClick={() => setSelectedPerson(person)}
                className="group text-left focus:outline-none"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#EFE6D2] border border-[#1D3C63]/12">
                  <img
                    src={person.image}
                    alt={`${person.role}역 ${person.name}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3.5 pt-3 border-t border-[#1D3C63]/16 flex items-baseline justify-between">
                  <span className="font-serif text-[13px] font-medium text-[#1D3C63]/60">
                    {person.role} 役
                  </span>
                  <span className="font-serif text-lg font-bold text-[#1D3C63]">
                    {person.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-8 border-t print-rule flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/creative-team?tab=semokkeut"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1D3C63] text-[#FCF686] font-bold text-sm"
            >
              <span>CREATIVE TEAM</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/works/dinoz"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#1D3C63] hover:bg-[#FCF686] text-[#1D3C63] font-bold text-sm"
            >
              <span>&lt;다이노즈&gt; 작품 보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {selectedPerson && (
        <div
          className="fixed inset-0 z-[100] bg-black/82 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white border border-[#1D3C63]/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPerson(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/5] bg-[#EFE6D2]">
              <img
                src={selectedPerson.image}
                alt={selectedPerson.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-6 flex items-center justify-between gap-4 border-t print-rule">
              <div>
                <div className="font-serif text-xs text-[#1D3C63]/60">{selectedPerson.role} 役</div>
                <div className="font-serif text-xl font-bold text-[#1D3C63] mt-0.5">
                  {selectedPerson.name}
                </div>
              </div>
              <Link
                to={`/photobooth?frame=semokkeut&idol=${encodeURIComponent(selectedPerson.image)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1D3C63] text-[#FCF686] text-xs font-bold"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>포토이즘</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
