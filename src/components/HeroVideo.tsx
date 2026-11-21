import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Volume2, VolumeX, Play, Pause, Maximize2, X, ArrowUpRight } from "lucide-react";
import { LOGOS } from "@/data/logos";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const muteBtnRef = useRef<HTMLButtonElement | null>(null);
  const userToggledMuteRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let unlockCleanup: (() => void) | null = null;

    const tryAutoplayWithSound = async () => {
      try {
        video.muted = false;
        await video.play();
        setMuted(false);
        setSoundBlocked(false);
        setPaused(false);
      } catch {
        // Browser autoplay policy blocked unmuted autoplay: play muted first
        // and unmute seamlessly on the very first user gesture.
        video.muted = true;
        setMuted(true);
        setSoundBlocked(true);
        try {
          await video.play();
          setPaused(false);
        } catch {
          setPaused(true);
        }

        const removeListeners = () => {
          window.removeEventListener("pointerdown", unlockSound);
          window.removeEventListener("keydown", unlockSound);
        };

        const unlockSound = (e: Event) => {
          removeListeners();
          if (
            userToggledMuteRef.current ||
            !videoRef.current ||
            (e.target instanceof Node && muteBtnRef.current?.contains(e.target))
          ) {
            return;
          }
          videoRef.current.muted = false;
          videoRef.current.play().catch(() => {});
          setMuted(false);
          setSoundBlocked(false);
          setPaused(false);
        };

        window.addEventListener("pointerdown", unlockSound);
        window.addEventListener("keydown", unlockSound);
        unlockCleanup = removeListeners;
      }
    };

    tryAutoplayWithSound();

    return () => {
      if (unlockCleanup) unlockCleanup();
    };
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    userToggledMuteRef.current = true;
    const nextMuted = !muted;
    videoRef.current.muted = nextMuted;
    setMuted(nextMuted);
    setSoundBlocked(false);
    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setPaused(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  return (
    <>
      <section className="relative pt-16 md:pt-[68px] bg-[#132A47] text-white">
        <div className="relative w-full h-[78vh] min-h-[540px] max-h-[820px] overflow-hidden bg-[#0B1729]">
          <video
            ref={videoRef}
            src="/media/video/dinoz-trailer.mp4"
            poster="/media/video/dinoz-poster-frame.webp"
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#132A47] via-[#132A47]/25 to-black/30" />

          {/* Minimal Swiss Controls */}
          <div className="absolute top-6 right-6 z-20 flex items-center border border-white/25 bg-black/40 backdrop-blur-md divide-x divide-white/20">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? "재생" : "일시정지"}
              className="p-2.5 text-white hover:bg-white/10 transition-colors"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              ref={muteBtnRef}
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "소리 켜기" : "음소거"}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 print-eyebrow transition-colors ${
                soundBlocked && muted
                  ? "bg-[#FCF686] text-[#1D3C63] font-bold hover:bg-white"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {muted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#FCF686]" />
              )}
              <span className="hidden sm:inline">
                {soundBlocked && muted ? "TAP FOR SOUND" : muted ? "MUTE" : "SOUND"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                setPaused(true);
                setModalOpen(true);
              }}
              aria-label="전체화면"
              className="p-2.5 text-white hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Swiss Program-Book Cover Grid */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-white/25 pt-7">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="print-eyebrow text-[#FCF686]">2026 SEASON PROGRAM</span>
                  <span className="h-px w-8 bg-white/35" />
                  <span className="print-eyebrow text-white/70">DINOZ TRAILER</span>
                </div>
                <img
                  src={LOGOS.mubornBlackWhiteOutline}
                  alt="MU:BORN"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <p className="text-[14.5px] text-white/85 max-w-xl leading-[1.75]">
                  서울예술대학교 학사학위 창작뮤지컬 개발 과정 — 창작뮤지컬 &lt;다이노즈&gt; · &lt;세상 모든 이야기의 끝&gt;
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-2.5">
                <Link
                  to="/tickets?show=dinoz"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FCF686] hover:bg-white text-[#1D3C63] font-bold text-sm transition-colors"
                >
                  <span>티켓 예매하기</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/works/dinoz"
                  className="px-5 py-3.5 border border-white/35 hover:bg-white/15 text-white text-sm font-medium backdrop-blur-xs transition-colors"
                >
                  다이노즈
                </Link>
                <Link
                  to="/works/semokkeut"
                  className="px-5 py-3.5 border border-white/35 hover:bg-white/15 text-white text-sm font-medium backdrop-blur-xs transition-colors"
                >
                  세상 모든 이야기의 끝
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-black border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-[#1D3C63] text-white border-b border-white/15">
              <span className="print-eyebrow text-[#FCF686]">DINOZ OFFICIAL TRAILER</span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
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
    </>
  );
}
