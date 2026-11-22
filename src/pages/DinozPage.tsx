import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Camera, X, Play } from "lucide-react";
import { DINOZ_WORK } from "@/data/content";
import { LOGOS } from "@/data/logos";
import mediaManifest from "@/data/media-manifest.json";
import {
  BarcodeSvg,
  SectionFolio,
  DinozVignette,
} from "@/components/CuteArt";

interface CastCardItem {
  order: number;
  role: string;
  name: string;
  image: string;
}

export default function DinozPage() {
  const [selectedPerson, setSelectedPerson] = useState<CastCardItem | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const dinozTopThree = mediaManifest.dinozCast.slice(0, 3);
  const dinozFourth = mediaManifest.dinozCast[3];
  const perfTopTwo = mediaManifest.dinozPerformers.slice(0, 2);
  const perfBottomThree = mediaManifest.dinozPerformers.slice(2, 5);

  return (
    <div className="min-h-screen bg-[#112442] text-white pt-16 md:pt-[68px]">
      {/* 00. COVER & INFORMATION */}
      <section className="py-16 sm:py-24 border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="01" title="WORK 01 · DINOZ" meta="ALIEN IDOL MUSICAL" dark />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <div className="w-full max-w-md mx-auto lg:mx-0 overflow-hidden bg-[#0A1324] border border-white/15">
                <img
                  src={DINOZ_WORK.poster}
                  alt="창작뮤지컬 <다이노즈> 포스터"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="max-w-md mx-auto lg:mx-0 pt-2.5 flex justify-between text-[11px] text-white/45 print-num">
                <span>OFFICIAL POSTER</span>
                <span>2026.12.05 – 12.06</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-[#FCF686] text-[#1D3C63] print-eyebrow">
                  2026 MU:BORN · ALIEN IDOL DEBUT
                </span>
                <div className="flex flex-wrap items-end gap-4">
                  <img
                    src={LOGOS.dinozKrWhite}
                    alt="다이노즈"
                    className="h-14 sm:h-18 w-auto object-contain"
                  />
                  <img
                    src={LOGOS.dinozEnWhite}
                    alt="DINOZ"
                    className="h-8 sm:h-10 w-auto object-contain opacity-75"
                  />
                </div>
              </div>

              {/* Swiss Hairline Spec Table */}
              <div className="border-y border-white/20 divide-y divide-white/12 text-[14.5px]">
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-white/50 pt-1">
                    공연명
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-bold text-white">
                    {DINOZ_WORK.info.공연명}
                  </div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-white/50 pt-1">
                    공연일시
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-[#FCF686] print-num space-y-0.5 leading-[1.65]">
                    {DINOZ_WORK.info.공연일시.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-white/50 pt-1">
                    러닝타임
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-white">90분</div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-white/50 pt-1">
                    공연장소
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-white">
                    {DINOZ_WORK.info.공연장소}
                  </div>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <div className="col-span-4 sm:col-span-3 print-eyebrow text-white/50 pt-1">
                    지도교수
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-semibold text-white">
                    {DINOZ_WORK.info.지도교수}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/tickets?show=dinoz"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FCF686] hover:bg-white text-[#1D3C63] font-bold text-sm transition-colors"
                >
                  <span>&lt;다이노즈&gt; 티켓 예매</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>트레일러 보기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. SYNOPSIS */}
      <section className="py-20 sm:py-28 bg-[#FCF686] text-[#1D3C63]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="02" title="SYNOPSIS" meta="DINOZ / STORY" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl font-bold">Synopsis</h2>
                <BarcodeSvg className="h-5 w-24 text-[#1D3C63]/55" />
              </div>
              <div className="hidden lg:block pt-6">
                <DinozVignette className="w-36 h-28" />
              </div>
            </div>
            <div className="lg:col-span-8 bg-[#1D3C63] text-white p-8 sm:p-12">
              <div className="print-measure print-body text-white/90 space-y-5">
                {DINOZ_WORK.synopsis.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. ABOUT THE WORK */}
      <section className="py-20 sm:py-28 border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionFolio index="03" title="ABOUT THE WORK" meta="DIRECTOR & WRITER NOTES" dark />

          <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-l border-white/15">
            <article className="p-8 sm:p-10 border-r border-b border-white/15 space-y-6">
              <div className="border-b border-white/15 pb-5 space-y-1.5">
                <h2 className="font-display text-2xl sm:text-[1.75rem] font-bold text-white">
                  About The Work
                </h2>
                <p className="text-[13px] font-semibold text-[#FCF686]">
                  {DINOZ_WORK.directorNote.role}
                </p>
              </div>
              <div className="print-body text-white/85 space-y-5">
                {DINOZ_WORK.directorNote.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>

            <article className="p-8 sm:p-10 border-r border-b border-white/15 space-y-6">
              <div className="border-b border-white/15 pb-5 space-y-1.5">
                <h2 className="font-display text-2xl sm:text-[1.75rem] font-bold text-white">
                  About The Work
                </h2>
                <p className="text-[13px] font-semibold text-[#8DB4E2]">
                  {DINOZ_WORK.writerNote.role}
                </p>
              </div>
              <div className="print-body text-white/85 space-y-5">
                {DINOZ_WORK.writerNote.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 04. CAST — Exact 3+1 (DINOZ) & 2+3 (Performer) Sharp Editorial Plates */}
      <section className="py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <SectionFolio index="04" title="CAST & PERFORMER" meta="DINOZ LINEUP" dark />

          {/* DINOZ 3 + 1 */}
          <div className="space-y-10">
            <div className="flex justify-center">
              <img src={LOGOS.dinozEnWhite} alt="DINOZ" className="h-6 sm:h-7 w-auto opacity-85" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {dinozTopThree.map((person) => (
                <button
                  key={person.order}
                  type="button"
                  onClick={() => setSelectedPerson(person)}
                  className="group text-left focus:outline-none"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-white/5 border border-white/12">
                    <img
                      src={person.image}
                      alt={`${person.role}역 ${person.name}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3.5 pt-3 border-t border-white/15 flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-[#FCF686]">{person.role} 役</span>
                    <span className="text-lg font-bold text-white">{person.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {dinozFourth && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPerson(dinozFourth)}
                  className="group text-left w-full max-w-[272px] focus:outline-none"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-white/5 border border-white/12">
                    <img
                      src={dinozFourth.image}
                      alt={`${dinozFourth.role}역 ${dinozFourth.name}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3.5 pt-3 border-t border-white/15 flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-[#8DB4E2]">
                      {dinozFourth.role} 役
                    </span>
                    <span className="text-lg font-bold text-white">{dinozFourth.name}</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Performer 2 + 3 */}
          <div className="space-y-10 pt-14 border-t border-white/15">
            <h3 className="text-center print-eyebrow text-white/80">PERFORMER</h3>

            <div className="grid grid-cols-2 gap-7 max-w-xl mx-auto">
              {perfTopTwo.map((person) => (
                <button
                  key={person.order}
                  type="button"
                  onClick={() => setSelectedPerson(person)}
                  className="group text-left focus:outline-none"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-white/5 border border-white/12">
                    <img
                      src={person.image}
                      alt={person.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-baseline justify-between">
                    <span className="text-xs text-white/50">Performer</span>
                    <span className="text-base font-bold text-white">{person.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 max-w-4xl mx-auto">
              {perfBottomThree.map((person) => (
                <button
                  key={person.order}
                  type="button"
                  onClick={() => setSelectedPerson(person)}
                  className="group text-left focus:outline-none"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-white/5 border border-white/12">
                    <img
                      src={person.image}
                      alt={person.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-baseline justify-between">
                    <span className="text-xs text-white/50">Performer</span>
                    <span className="text-base font-bold text-white">{person.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/tickets?show=dinoz"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FCF686] text-[#1D3C63] font-bold text-sm"
            >
              <span>&lt;다이노즈&gt; 티켓 예매</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/creative-team?tab=dinoz"
                className="inline-flex items-center gap-1.5 px-5 py-3 border border-white/25 hover:bg-white/10 text-white text-sm font-medium"
              >
                <span>CREATIVE TEAM</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/works/semokkeut"
                className="inline-flex items-center gap-1.5 px-5 py-3 border border-white/25 hover:bg-white/10 text-white text-sm font-medium"
              >
                <span>&lt;세상 모든 이야기의 끝&gt;</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {selectedPerson && (
        <div
          className="fixed inset-0 z-[100] bg-black/82 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#1D3C63] text-white border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPerson(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/5] bg-black">
              <img
                src={selectedPerson.image}
                alt={selectedPerson.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-6 flex items-center justify-between gap-4 border-t border-white/15">
              <div>
                <div className="text-xs text-[#FCF686]">
                  {selectedPerson.role === "퍼포머" ? "Performer" : `${selectedPerson.role} 役`}
                </div>
                <div className="text-xl font-bold mt-0.5">{selectedPerson.name}</div>
              </div>
              <Link
                to={`/photobooth?frame=dinoz&idol=${encodeURIComponent(selectedPerson.image)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FCF686] text-[#1D3C63] text-xs font-bold"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>뮤본네컷</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {trailerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-black border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-[#1D3C63] text-white border-b border-white/15">
              <span className="print-eyebrow text-[#FCF686]">DINOZ OFFICIAL TRAILER</span>
              <button
                type="button"
                onClick={() => setTrailerOpen(false)}
                className="p-1.5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <video
              src="/media/video/dinoz-trailer.mp4"
              controls
              autoPlay
              playsInline
              className="w-full max-h-[80vh] bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
