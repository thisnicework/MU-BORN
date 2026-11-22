import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Camera,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Users,
  Video,
  VideoOff,
  Search,
} from "lucide-react";
import mediaManifest from "@/data/media-manifest.json";
import { LOGOS } from "@/data/logos";
import { SectionFolio } from "@/components/CuteArt";

type FrameThemeKey =
  | "dinoz-film"
  | "dinoz-cosmic"
  | "semo-pastel"
  | "semo-midnight"
  | "muborn-yellow";

type FilterKey = "original" | "soft" | "bw" | "warm";

type ShowKey = "dinoz" | "semokkeut";

type ProfileCategory =
  | "dinoz-cast"
  | "dinoz-perf"
  | "dinoz-team"
  | "semo-cast"
  | "semo-team";

interface ProfileOption {
  id: string;
  show: ShowKey;
  category: ProfileCategory;
  groupLabel: string;
  role: string;
  name: string;
  image: string;
  noPhoto?: boolean;
}

interface FrameTheme {
  key: FrameThemeKey;
  show: ShowKey | "common";
  label: string;
  subtitle: string;
  swatchA: string;
  swatchB: string;
  bgTop: string;
  bgBottom: string;
  accent: string;
  accent2: string;
  textColor: string;
  mutedText: string;
  frameBorder: string;
  logoSrc: string;
  secondaryLogoSrc?: string;
  sideText: string;
  footerLeft: string;
  footerRight: string;
  style: "film" | "cosmic" | "pastel" | "storybook" | "muborn";
}

const FRAME_THEMES: Record<FrameThemeKey, FrameTheme> = {
  "dinoz-film": {
    key: "dinoz-film",
    show: "dinoz",
    label: "DINOZ · 다크 필름",
    subtitle: "IDOL FILM BLACK · CYAN",
    swatchA: "#0B0D12",
    swatchB: "#38BDF8",
    bgTop: "#090B10",
    bgBottom: "#111622",
    accent: "#38BDF8",
    accent2: "#F43F5E",
    textColor: "#FFFFFF",
    mutedText: "rgba(255,255,255,0.5)",
    frameBorder: "rgba(56,189,248,0.45)",
    logoSrc: LOGOS.dinozEnWhite,
    secondaryLogoSrc: LOGOS.dinozKrWhite,
    sideText: "KEEP YOURSELF ALIVE · DINOZ EARTH CONQUEST · 2026 MU:BORN",
    footerLeft: "DINOZ OFFICIAL FRAME",
    footerRight: "MU:BORN × 4CUT",
    style: "film",
  },
  "dinoz-cosmic": {
    key: "dinoz-cosmic",
    show: "dinoz",
    label: "DINOZ · 코스믹 네이비",
    subtitle: "SPACE NAVY · LEMON",
    swatchA: "#112442",
    swatchB: "#FCF686",
    bgTop: "#0C1930",
    bgBottom: "#1A3560",
    accent: "#FCF686",
    accent2: "#8DB4E2",
    textColor: "#FFFFFF",
    mutedText: "rgba(255,255,255,0.55)",
    frameBorder: "rgba(252,246,134,0.45)",
    logoSrc: LOGOS.dinozKrWhite,
    secondaryLogoSrc: LOGOS.dinozEnWhite,
    sideText: "ALIEN IDOL DEBUT PROJECT · DINOZ · 2026.12",
    footerLeft: "DINOZ · NAMSAN DRAMA CENTER",
    footerRight: "2026 MU:BORN",
    style: "cosmic",
  },
  "semo-pastel": {
    key: "semo-pastel",
    show: "semokkeut",
    label: "세모끝 · 파스텔 동화",
    subtitle: "BLUSH PINK · BUTTER CREAM",
    swatchA: "#FADCE4",
    swatchB: "#FFF2BE",
    bgTop: "#FADCE4",
    bgBottom: "#FFF3C4",
    accent: "#1D3C63",
    accent2: "#E88FA5",
    textColor: "#1D3C63",
    mutedText: "rgba(29,60,99,0.58)",
    frameBorder: "rgba(255,255,255,0.95)",
    logoSrc: LOGOS.semokkeutBlack,
    sideText: "THE END OF EVERY STORY · FAIRY TALE · 2026 MU:BORN",
    footerLeft: "세상 모든 이야기의 끝",
    footerRight: "MU:BORN × 4CUT",
    style: "pastel",
  },
  "semo-midnight": {
    key: "semo-midnight",
    show: "semokkeut",
    label: "세모끝 · 미드나잇 골드",
    subtitle: "TWILIGHT INK · ANTIQUE GOLD",
    swatchA: "#1D1714",
    swatchB: "#DFB86E",
    bgTop: "#1A1512",
    bgBottom: "#292019",
    accent: "#DFB86E",
    accent2: "#F6E7C8",
    textColor: "#FAF5E8",
    mutedText: "rgba(250,245,232,0.55)",
    frameBorder: "rgba(223,184,110,0.55)",
    logoSrc: LOGOS.semokkeutWhite,
    sideText: "THE END OF EVERY STORY · CHAPTER 2026 · MU:BORN",
    footerLeft: "THE END OF EVERY STORY",
    footerRight: "2026.12 · SIA",
    style: "storybook",
  },
  "muborn-yellow": {
    key: "muborn-yellow",
    show: "common",
    label: "MU:BORN · 2026 옐로우",
    subtitle: "LEMON YELLOW · NAVY",
    swatchA: "#FCF686",
    swatchB: "#1D3C63",
    bgTop: "#FCF686",
    bgBottom: "#F9EE66",
    accent: "#1D3C63",
    accent2: "#8DB4E2",
    textColor: "#1D3C63",
    mutedText: "rgba(29,60,99,0.62)",
    frameBorder: "rgba(29,60,99,0.85)",
    logoSrc: LOGOS.mubornBlackLine,
    sideText: "HOW MANY POSSIBILITIES CAN WE FIND? · 2026 MU:BORN",
    footerLeft: "HOW MANY POSSIBILITIES?",
    footerRight: "2026 MU:BORN",
    style: "muborn",
  },
};

const FILTERS: Array<{ key: FilterKey; label: string; css: string }> = [
  { key: "original", label: "원본", css: "none" },
  { key: "soft", label: "뽀샤시 필름", css: "brightness(1.06) contrast(0.95) saturate(1.08)" },
  { key: "warm", label: "동화 웜톤", css: "sepia(0.16) saturate(1.1) brightness(1.04)" },
  { key: "bw", label: "흑백 필름", css: "grayscale(1) contrast(1.12) brightness(1.03)" },
];

const SHOW_TABS: Array<{
  key: ShowKey;
  label: string;
  en: string;
  defaultCategory: ProfileCategory;
  categories: Array<{ key: ProfileCategory; label: string }>;
}> = [
    {
      key: "dinoz",
      label: "다이노즈",
      en: "DINOZ",
      defaultCategory: "dinoz-cast",
      categories: [
        { key: "dinoz-cast", label: "캐스트" },
        { key: "dinoz-perf", label: "퍼포머" },
        { key: "dinoz-team", label: "창작진" },
      ],
    },
    {
      key: "semokkeut",
      label: "세상 모든 이야기의 끝",
      en: "SEMOKKEUT",
      defaultCategory: "semo-cast",
      categories: [
        { key: "semo-cast", label: "캐스트" },
        { key: "semo-team", label: "창작진" },
      ],
    },
  ];

const ALL_PROFILES: ProfileOption[] = [
  ...mediaManifest.dinozCast.map((p) => ({
    id: `dc-${p.order}`,
    show: "dinoz" as ShowKey,
    category: "dinoz-cast" as ProfileCategory,
    groupLabel: "다이노즈",
    role: `${p.role} 役`,
    name: p.name,
    image: p.image,
    noPhoto: (p as { noPhoto?: boolean }).noPhoto,
  })),
  ...mediaManifest.dinozPerformers.map((p) => ({
    id: `dp-${p.order}`,
    show: "dinoz" as ShowKey,
    category: "dinoz-perf" as ProfileCategory,
    groupLabel: "다이노즈",
    role: "Performer",
    name: p.name,
    image: p.image,
    noPhoto: (p as { noPhoto?: boolean }).noPhoto,
  })),
  ...mediaManifest.dinozCreative.map((p) => ({
    id: `dt-${p.order}`,
    show: "dinoz" as ShowKey,
    category: "dinoz-team" as ProfileCategory,
    groupLabel: "다이노즈 창작진",
    role: p.role,
    name: p.name,
    image: p.image,
    noPhoto: (p as { noPhoto?: boolean }).noPhoto,
  })),
  ...mediaManifest.semokkeutCast.map((p) => ({
    id: `sc-${p.order}`,
    show: "semokkeut" as ShowKey,
    category: "semo-cast" as ProfileCategory,
    groupLabel: "세모끝",
    role: `${p.role} 役`,
    name: p.name,
    image: p.image,
    noPhoto: (p as { noPhoto?: boolean }).noPhoto,
  })),
  ...mediaManifest.semokkeutCreative.map((p) => ({
    id: `st-${p.order}`,
    show: "semokkeut" as ShowKey,
    category: "semo-team" as ProfileCategory,
    groupLabel: "세모끝 창작진",
    role: p.role,
    name: p.name,
    image: p.image,
    noPhoto: (p as { noPhoto?: boolean }).noPhoto,
  })),
];

function mapInitialFrame(param: string | null): FrameThemeKey {
  if (param === "dinoz" || param === "dinoz-film") return "dinoz-film";
  if (param === "dinoz-cosmic") return "dinoz-cosmic";
  if (param === "semokkeut" || param === "semo-pastel") return "semo-pastel";
  if (param === "semo-midnight") return "semo-midnight";
  if (param === "claw" || param === "muborn" || param === "muborn-yellow") return "muborn-yellow";
  return "dinoz-film";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  topBias = 0.22,
  zoom = 1.0
) {
  const ir = img.width / img.height;
  const dr = dw / dh;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;
  if (ir > dr) {
    sw = img.height * dr;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / dr;
    sy = (img.height - sh) * topBias;
  }
  if (zoom > 1) {
    const nsw = sw / zoom;
    const nsh = sh / zoom;
    sx += (sw - nsw) / 2;
    sy += (sh - nsh) * 0.3;
    sw = nsw;
    sh = nsh;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + r * 0.12, cy - r * 0.12, cx + r, cy);
  ctx.quadraticCurveTo(cx + r * 0.12, cy + r * 0.12, cx, cy + r);
  ctx.quadraticCurveTo(cx - r * 0.12, cy + r * 0.12, cx - r, cy);
  ctx.quadraticCurveTo(cx - r * 0.12, cy - r * 0.12, cx, cy - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMiniBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  color: string
) {
  const bars = [3, 1.5, 4, 2, 1.5, 5, 2, 3.5, 1.5, 4, 2, 3, 1.5, 4.5, 2, 3];
  ctx.save();
  ctx.fillStyle = color;
  let cur = x;
  for (let i = 0; i < bars.length; i++) {
    ctx.fillRect(cur, y, bars[i], h);
    cur += bars[i] + (i % 2 === 0 ? 2 : 3);
  }
  ctx.restore();
}

type PartnerMode = "per-cut" | "single";

const SEMO_POSTER_OPTION: ProfileOption = {
  id: "semo-poster",
  show: "semokkeut",
  category: "semo-cast",
  groupLabel: "세모끝",
  role: "POSTER",
  name: "세상 모든 이야기의 끝",
  image: "/media/posters/semokkeut.webp",
};

function getDefaultCutPartners(
  show: ShowKey
): [ProfileOption, ProfileOption, ProfileOption, ProfileOption] {
  if (show === "semokkeut") {
    const cast = ALL_PROFILES.filter((p) => p.category === "semo-cast");
    return [
      cast[0] || SEMO_POSTER_OPTION,
      cast[1] || cast[0] || SEMO_POSTER_OPTION,
      cast[2] || cast[0] || SEMO_POSTER_OPTION,
      SEMO_POSTER_OPTION,
    ];
  }
  const cast = ALL_PROFILES.filter((p) => p.category === "dinoz-cast");
  return [
    cast[0] || ALL_PROFILES[0],
    cast[1] || cast[0] || ALL_PROFILES[0],
    cast[2] || cast[0] || ALL_PROFILES[0],
    cast[3] || cast[0] || ALL_PROFILES[0],
  ];
}

export default function PhotoboothPage() {
  const [searchParams] = useSearchParams();
  const initialIdolImg = searchParams.get("idol");
  const requestedFrame = mapInitialFrame(searchParams.get("frame"));
  const requestedShow = FRAME_THEMES[requestedFrame].show;
  const matchedIdol = initialIdolImg
    ? ALL_PROFILES.find((p) => p.image === initialIdolImg && !p.noPhoto)
    : undefined;

  const initialShow: ShowKey = matchedIdol
    ? matchedIdol.show
    : requestedShow === "semokkeut"
      ? "semokkeut"
      : "dinoz";

  const initialMode: PartnerMode = matchedIdol ? "single" : "per-cut";
  const initialCuts: [ProfileOption, ProfileOption, ProfileOption, ProfileOption] = matchedIdol
    ? [matchedIdol, matchedIdol, matchedIdol, matchedIdol]
    : getDefaultCutPartners(initialShow);

  const initialTheme: FrameThemeKey =
    FRAME_THEMES[requestedFrame].show === "common" ||
      FRAME_THEMES[requestedFrame].show === initialShow
      ? requestedFrame
      : initialShow === "semokkeut"
        ? "semo-pastel"
        : "dinoz-film";

  const [partnerMode, setPartnerMode] = useState<PartnerMode>(initialMode);
  const [cutPartners, setCutPartners] =
    useState<[ProfileOption, ProfileOption, ProfileOption, ProfileOption]>(initialCuts);
  const [activeCutIdx, setActiveCutIdx] = useState<number>(0);
  const [showTab, setShowTab] = useState<ShowKey>(initialShow);
  const [profileTab, setProfileTab] = useState<ProfileCategory>(
    matchedIdol
      ? matchedIdol.category
      : initialShow === "semokkeut"
        ? "semo-cast"
        : "dinoz-cast"
  );
  const [profileSearch, setProfileSearch] = useState("");
  const [themeKey, setThemeKey] = useState<FrameThemeKey>(initialTheme);
  const [filterKey, setFilterKey] = useState<FilterKey>("soft");
  const [isSample, setIsSample] = useState(false);
  const [userPhotos, setUserPhotos] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastArchivedSignatureRef = useRef<string>("");

  const activeShowConfig =
    SHOW_TABS.find((s) => s.key === showTab) || SHOW_TABS[0];

  const availableThemes = useMemo(
    () =>
      Object.values(FRAME_THEMES).filter(
        (t) => t.show === showTab || t.show === "common"
      ),
    [showTab]
  );

  const handleSelectShow = (show: (typeof SHOW_TABS)[number]) => {
    setShowTab(show.key);
    setProfileTab(show.defaultCategory);
    setProfileSearch("");
    setActiveCutIdx(0);

    if (partnerMode === "per-cut") {
      setCutPartners(getDefaultCutPartners(show.key));
    } else {
      const firstOfShow = ALL_PROFILES.find(
        (p) => p.show === show.key && !p.noPhoto
      );
      if (firstOfShow) {
        setCutPartners([firstOfShow, firstOfShow, firstOfShow, firstOfShow]);
      }
    }

    const currentThemeShow = FRAME_THEMES[themeKey].show;
    if (currentThemeShow !== "common" && currentThemeShow !== show.key) {
      setThemeKey(show.key === "semokkeut" ? "semo-pastel" : "dinoz-film");
    }
  };

  const handleSwitchMode = (nextMode: PartnerMode) => {
    setPartnerMode(nextMode);
    if (nextMode === "per-cut") {
      const allSame = cutPartners.every((p) => p.id === cutPartners[0].id);
      if (allSame) {
        setCutPartners(getDefaultCutPartners(showTab));
      }
      setActiveCutIdx(0);
    } else {
      const base =
        cutPartners[activeCutIdx]?.id === SEMO_POSTER_OPTION.id
          ? cutPartners[0]
          : cutPartners[activeCutIdx] || cutPartners[0];
      setCutPartners([base, base, base, base]);
    }
  };

  const handleSelectPartner = (p: ProfileOption) => {
    if (partnerMode === "per-cut") {
      setCutPartners((prev) => {
        const next = [...prev] as [
          ProfileOption,
          ProfileOption,
          ProfileOption,
          ProfileOption,
        ];
        next[activeCutIdx] = p;
        return next;
      });
      setActiveCutIdx((prev) => (prev + 1) % 4);
    } else {
      setCutPartners([p, p, p, p]);
    }

    setShowTab(p.show);
    setProfileTab(p.category);
    const currentThemeShow = FRAME_THEMES[themeKey].show;
    if (currentThemeShow !== "common" && currentThemeShow !== p.show) {
      setThemeKey(p.show === "semokkeut" ? "semo-pastel" : "dinoz-film");
    }
  };

  const filteredProfiles = useMemo(() => {
    const q = profileSearch.trim().toLowerCase();
    if (q) {
      return ALL_PROFILES.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.groupLabel.toLowerCase().includes(q)
      );
    }
    const base = ALL_PROFILES.filter((p) => p.category === profileTab);
    if (profileTab === "semo-cast" && partnerMode === "per-cut") {
      return [...base, SEMO_POSTER_OPTION];
    }
    return base;
  }, [profileTab, profileSearch, partnerMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 60);
    } catch {
      setCameraError("카메라 접근 권한이 필요합니다. 아래 '사진 업로드'로도 4컷을 만들 수 있습니다.");
    }
  };

  const captureSlot = (slotIdx: number) => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const tmp = document.createElement("canvas");
    tmp.width = v.videoWidth || 640;
    tmp.height = v.videoHeight || 480;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    tctx.translate(tmp.width, 0);
    tctx.scale(-1, 1);
    tctx.drawImage(v, 0, 0, tmp.width, tmp.height);
    const dataUrl = tmp.toDataURL("image/jpeg", 0.92);
    setIsSample(false);
    setUserPhotos((prev) => {
      const next = [...prev];
      next[slotIdx] = dataUrl;
      return next;
    });
  };

  const startAutoFourShot = async () => {
    if (!cameraOn) await startCamera();
    for (let i = 0; i < 4; i++) {
      for (let c = 3; c >= 1; c--) {
        setCountdown(c);
        await new Promise((r) => setTimeout(r, 850));
      }
      setCountdown(null);
      captureSlot(i);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>, singleIndex?: number) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.slice(0, 4).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        setIsSample(false);
        setUserPhotos((prev) => {
          const next = [...prev];
          const target = singleIndex !== undefined ? singleIndex : idx;
          if (target < 4) next[target] = result;
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const fillDemoWithCast = () => {
    const isSemo = themeKey.startsWith("semo");
    const sample = isSemo
      ? [
        "/media/cast/semokkeut-01.webp",
        "/media/cast/semokkeut-02.webp",
        "/media/cast/semokkeut-03.webp",
        "/media/posters/semokkeut.webp",
      ]
      : [
        "/media/cast/dinoz-01.webp",
        "/media/cast/dinoz-02.webp",
        "/media/cast/dinoz-03.webp",
        "/media/cast/dinoz-04.webp",
      ];
    setIsSample(true);
    setUserPhotos(sample);
  };

  // Rich Photoism-inspired Canvas Renderer (640 x 1920 retina strip)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = FRAME_THEMES[themeKey];
    const filterCss = FILTERS.find((f) => f.key === filterKey)?.css || "none";
    const W = 640;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    let cancelled = false;

    (async () => {
      // 1. Rich Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, theme.bgTop);
      grad.addColorStop(1, theme.bgBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. Theme-Specific Decorative Frame Background Artwork (inspired by reference image11!)
      if (theme.style === "film") {
        // Monsta X Photoism style: side film strips, crimson/cyan triangle notches, frame numbers
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.strokeRect(22, 18, W - 44, H - 36);

        // Left & Right film marker triangles + numbers (49, 50, 51, 52)
        const filmNums = ["49", "50", "51", "52"];
        for (let i = 0; i < 4; i++) {
          const cy = 340 + i * 405;
          // Left triangle
          ctx.fillStyle = theme.accent2;
          ctx.beginPath();
          ctx.moveTo(14, cy - 6);
          ctx.lineTo(24, cy);
          ctx.lineTo(14, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Right frame number
          ctx.save();
          ctx.translate(W - 17, cy);
          ctx.rotate(-Math.PI / 2);
          ctx.fillStyle = "rgba(255,255,255,0.45)";
          ctx.font = "600 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText(filmNums[i], 0, 0);
          ctx.restore();
        }

        // Right margin vertical repeating text (like "KEEP YOURSELF ALIVE · PHOTOISM")
        ctx.save();
        ctx.translate(W - 17, H / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.font = "600 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(theme.sideText + "   ·   " + theme.sideText, 0, 0);
        ctx.restore();

        // Cyber sparkles around top header
        drawFourPointStar(ctx, 548, 56, 12, theme.accent);
        drawFourPointStar(ctx, 574, 82, 7, "#FCF686");
        drawFourPointStar(ctx, 526, 92, 5, theme.accent2);
      } else if (theme.style === "cosmic") {
        // Cosmic orbital rings & stars
        ctx.strokeStyle = "rgba(252,246,134,0.16)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(W / 2, 76, 260, 44, -0.06, 0, Math.PI * 2);
        ctx.stroke();

        drawFourPointStar(ctx, 74, 62, 13, "#FCF686");
        drawFourPointStar(ctx, 566, 68, 11, "#8DB4E2");
        drawFourPointStar(ctx, 540, 102, 6, "#FCF686");
        drawFourPointStar(ctx, 96, 1842, 10, "#FCF686");
        drawFourPointStar(ctx, 544, 1850, 8, "#8DB4E2");
      } else if (theme.style === "pastel") {
        // Karina aespa Photoism style: dreamy pastel blush-to-cream with soft scalloped top arch & sparkles!
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(W / 2, 146, 340, Math.PI, 0);
        ctx.fill();

        // Delicate twinkling pastel stars
        drawFourPointStar(ctx, 68, 66, 13, "#FFFFFF");
        drawFourPointStar(ctx, 92, 92, 7, "#E88FA5");
        drawFourPointStar(ctx, 566, 64, 14, "#FFFFFF");
        drawFourPointStar(ctx, 538, 94, 8, "#F4BE52");
        drawFourPointStar(ctx, 66, 1846, 10, "#E88FA5");
        drawFourPointStar(ctx, 572, 1840, 11, "#FFFFFF");

        // Subtle side vertical storybook whisper
        ctx.save();
        ctx.translate(W - 16, H / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "rgba(29,60,99,0.28)";
        ctx.font = "600 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(theme.sideText, 0, 0);
        ctx.restore();
      } else if (theme.style === "storybook") {
        // Midnight Gold double-ruled storybook frame
        ctx.strokeStyle = "rgba(223,184,110,0.38)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(20, 20, W - 40, H - 40);
        ctx.strokeStyle = "rgba(223,184,110,0.16)";
        ctx.strokeRect(27, 27, W - 54, H - 54);

        // Corner diamond stars
        drawFourPointStar(ctx, 42, 42, 10, "#DFB86E");
        drawFourPointStar(ctx, W - 42, 42, 10, "#DFB86E");
        drawFourPointStar(ctx, 42, H - 42, 10, "#DFB86E");
        drawFourPointStar(ctx, W - 42, H - 42, 10, "#DFB86E");
      } else if (theme.style === "muborn") {
        // Signature MU:BORN yellow & navy Swiss graphic frame
        ctx.strokeStyle = "#1D3C63";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, W - 40, H - 40);
        drawFourPointStar(ctx, 568, 66, 12, "#1D3C63");
        drawFourPointStar(ctx, 540, 88, 7, "#8DB4E2");
      }

      // 3. Top Photoism-Style Pill + Official Show Logo Header
      // Left pill badge ("photoism" style -> "MU:BORN")
      ctx.save();
      const pillX = 44;
      const pillY = 48;
      const pillW = 112;
      const pillH = 34;
      ctx.fillStyle = theme.style === "pastel" || theme.style === "muborn" ? "#1D3C63" : "rgba(255,255,255,0.14)";
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 17);
      ctx.fill();
      ctx.fillStyle = theme.style === "pastel" || theme.style === "muborn" ? "#FCF686" : "#FFFFFF";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("MU:BORN", pillX + pillW / 2, pillY + pillH / 2 + 1);
      ctx.restore();

      // Center/Right Official Logo
      try {
        const logoImg = await loadImage(theme.logoSrc);
        if (cancelled) return;
        const maxLogoH = theme.style === "pastel" || theme.style === "storybook" ? 76 : 52;
        const maxLogoW = 240;
        const scale = Math.min(maxLogoW / logoImg.width, maxLogoH / logoImg.height);
        const lw = logoImg.width * scale;
        const lh = logoImg.height * scale;
        ctx.drawImage(logoImg, (W - lw) / 2 + 24, 30 + (82 - lh) / 2, lw, lh);
      } catch {
        ctx.fillStyle = theme.textColor;
        ctx.font = "bold 30px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("MU:BORN 2026", W / 2, 74);
      }

      // 4. Load Partner Images (per-cut individual profiles supported!)
      const imageCache = new Map<string, HTMLImageElement>();
      const uniqueUrls = Array.from(new Set(cutPartners.map((p) => p.image).filter(Boolean)));
      await Promise.all(
        uniqueUrls.map(async (url) => {
          try {
            const img = await loadImage(url);
            imageCache.set(url, img);
          } catch {
            // ignore broken image
          }
        })
      );
      if (cancelled) return;

      const allSamePartner = cutPartners.every((p) => p.id === cutPartners[0].id);

      // 5. Render 4 Cuts (per-cut individual cast or single-partner zoom variation!)
      const padX = 44;
      const frameW = W - padX * 2; // 552
      const frameH = 382;
      const gapY = 22;
      const startY = 142;

      const partnerVariants = [
        { bias: 0.14, zoom: 1.0 },
        { bias: 0.2, zoom: 1.12 },
        { bias: 0.12, zoom: 1.06 },
        { bias: 0.18, zoom: 1.18 },
      ];

      for (let i = 0; i < 4; i++) {
        const y = startY + i * (frameH + gapY);
        const cutPartner = cutPartners[i];
        const loadedPartner = imageCache.get(cutPartner.image) || null;

        ctx.save();
        // Optional subtle rounded corners for pastel frame
        const cornerR = theme.style === "pastel" ? 14 : 0;
        if (cornerR > 0) {
          ctx.beginPath();
          ctx.roundRect(padX, y, frameW, frameH, cornerR);
          ctx.clip();
        }

        // Photo slot backdrop
        ctx.fillStyle =
          theme.style === "pastel" || theme.style === "muborn" ? "#F7F5EE" : "#151A28";
        ctx.fillRect(padX, y, frameW, frameH);

        const photoSrc = userPhotos[i];
        ctx.filter = filterCss;

        const halfW = frameW / 2;

        // Left half: User photo
        if (photoSrc) {
          try {
            const uImg = await loadImage(photoSrc);
            if (cancelled) return;
            drawCover(ctx, uImg, padX, y, halfW, frameH, 0.22, 1.0);
          } catch {
            // ignore
          }
        } else {
          ctx.filter = "none";
          ctx.fillStyle =
            theme.style === "pastel"
              ? "#FFFDF9"
              : theme.style === "muborn"
                ? "#FAF9F4"
                : "#192136";
          ctx.fillRect(padX, y, halfW, frameH);
          ctx.fillStyle = theme.accent;
          ctx.font = "bold 17px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`CUT 0${i + 1}`, padX + halfW / 2, y + frameH / 2 - 8);
          ctx.font = "12px sans-serif";
          ctx.fillStyle = theme.mutedText;
          ctx.fillText("내 사진 촬영 / 업로드", padX + halfW / 2, y + frameH / 2 + 16);
          ctx.filter = filterCss;
        }

        // Right half: Individual Cut Profile Photo
        if (loadedPartner) {
          if (cutPartner.id === SEMO_POSTER_OPTION.id) {
            drawCover(ctx, loadedPartner, padX + halfW, y, halfW, frameH, 0.45, 1.0);
          } else if (allSamePartner) {
            const v = partnerVariants[i];
            drawCover(ctx, loadedPartner, padX + halfW, y, halfW, frameH, v.bias, v.zoom);
          } else {
            drawCover(ctx, loadedPartner, padX + halfW, y, halfW, frameH, 0.14, 1.04);
          }
        }

        // Soft seam divider
        ctx.filter = "none";
        ctx.fillStyle = theme.bgTop;
        ctx.fillRect(padX + halfW - 1.5, y, 3, frameH);

        // Subtle name tag inside each cut (for per-cut cast) or Cut 4 only (for single partner)
        if (!allSamePartner || i === 3) {
          const tagText =
            cutPartner.id === SEMO_POSTER_OPTION.id
              ? cutPartner.name
              : allSamePartner
                ? `WITH. ${cutPartner.role} ${cutPartner.name}`
                : `${cutPartner.role} ${cutPartner.name}`;
          ctx.font = "bold 11px sans-serif";
          const tw = ctx.measureText(tagText).width + 20;
          ctx.fillStyle = "rgba(17, 36, 66, 0.78)";
          ctx.fillRect(padX + frameW - tw - 10, y + frameH - 32, tw, 22);
          ctx.fillStyle = "#FCF686";
          ctx.textAlign = "right";
          ctx.fillText(tagText, padX + frameW - 20, y + frameH - 17);
        }

        ctx.restore();

        // Crisp border around each cut
        ctx.save();
        ctx.strokeStyle = theme.frameBorder;
        ctx.lineWidth = theme.style === "pastel" ? 3 : 1.5;
        if (cornerR > 0) {
          ctx.beginPath();
          ctx.roundRect(padX, y, frameW, frameH, cornerR);
          ctx.stroke();
        } else {
          ctx.strokeRect(padX, y, frameW, frameH);
        }
        ctx.restore();
      }

      // 6. Bottom MU:BORN 4-Cut Colophon Footer
      const footY = 1796;
      ctx.strokeStyle = theme.frameBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, footY);
      ctx.lineTo(W - padX, footY);
      ctx.stroke();

      // Left: Footer title & partner summary
      ctx.textAlign = "left";
      ctx.fillStyle = theme.accent;
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(theme.footerLeft, padX, footY + 32);

      const footerPartnerLine = allSamePartner
        ? `WITH ${cutPartners[0].role} ${cutPartners[0].name} · @sia.bfa.muborn`
        : `WITH ${showTab === "dinoz" ? "DINOZ" : "세모끝"} 4-CUT · @sia.bfa.muborn`;

      ctx.fillStyle = theme.mutedText;
      ctx.font = "500 11px sans-serif";
      ctx.fillText(footerPartnerLine, padX, footY + 54);

      // Right: Barcode + date stamp
      drawMiniBarcode(ctx, W - padX - 88, footY + 18, 22, theme.accent);
      ctx.textAlign = "right";
      ctx.fillStyle = theme.mutedText;
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${theme.footerRight} · 2026.12`, W - padX, footY + 58);
    })();

    return () => {
      cancelled = true;
    };
  }, [themeKey, filterKey, cutPartners, showTab, userPhotos]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const allSame = cutPartners.every((p) => p.id === cutPartners[0].id);
    const suffix = allSame ? cutPartners[0].name : `${showTab}-4cut`;
    const pngDataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `muborn-2026-4cut-${themeKey}-${suffix}.png`;
    link.href = pngDataUrl;
    link.click();

    // Silent background archive to Vercel Blob when at least 1 real user photo is present
    const hasUserPhoto = !isSample && userPhotos.some((p) => Boolean(p));
    if (hasUserPhoto) {
      const signature = `${themeKey}|${filterKey}|${cutPartners.map((p) => p.id).join(",")}|${userPhotos
        .map((p) => (p ? p.slice(-48) : ""))
        .join(",")}`;
      if (lastArchivedSignatureRef.current !== signature) {
        lastArchivedSignatureRef.current = signature;
        const archiveDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        fetch("/api/photobooth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDataUrl: archiveDataUrl,
            show: showTab,
            themeKey,
            filterKey,
            partners: cutPartners.map((p) =>
              p.id === SEMO_POSTER_OPTION.id ? "포스터" : `${p.role}-${p.name}`
            ),
          }),
        }).catch(() => {
          // Allow retry if upload failed
          lastArchivedSignatureRef.current = "";
        });
      }
    }
  };

  return (
    <div className="pt-16 md:pt-[68px] min-h-screen bg-[#FAF9F4] text-[#1D3C63]">
      <section className="bg-[#FCF686] py-14 sm:py-18 border-b border-[#1D3C63]/16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SectionFolio index="00" title="MU:BORN 4-CUT" meta="CAST & CREATIVE TEAM · 103 PROFILES" />
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D3C63] print-display">
              뮤본네컷 프레임
            </h1>
            <p className="text-sm text-[#1D3C63]/75">
              &lt;다이노즈&gt;·&lt;세상 모든 이야기의 끝&gt; 배우와 창작진을 컷마다 개별로 배치하거나 원하는 1인을 선택해 나만의 4컷을 저장하세요.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* 01. Partner Picker (Grouped by Show: DINOZ vs SEMOKKEUT, Per-Cut Individual or Single) */}
          <div className="bg-white border border-[#1D3C63]/16 p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b print-rule">
              <div className="flex items-center gap-2.5">
                <span className="print-num text-xs font-bold text-[#1D3C63]">01</span>
                <h2 className="text-sm font-bold text-[#1D3C63] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  함께 찍을 프로필 선택 ({ALL_PROFILES.length}명)
                </h2>
              </div>

              {/* Per-Cut Individual vs Single Person Mode Toggle */}
              <div className="inline-flex border border-[#1D3C63]/20 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("per-cut")}
                  className={`px-2.5 py-1 transition-colors ${partnerMode === "per-cut"
                    ? "bg-[#1D3C63] text-[#FCF686] font-bold"
                    : "bg-[#FAF9F4] text-[#1D3C63]/70 hover:bg-white"
                    }`}
                >
                  컷별 개별 배치
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("single")}
                  className={`px-2.5 py-1 border-l border-[#1D3C63]/20 transition-colors ${partnerMode === "single"
                    ? "bg-[#1D3C63] text-[#FCF686] font-bold"
                    : "bg-[#FAF9F4] text-[#1D3C63]/70 hover:bg-white"
                    }`}
                >
                  1인 4컷 고정
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Show Tabs: 다이노즈 / 세상 모든 이야기의 끝 */}
              <div className="grid grid-cols-2 border border-[#1D3C63]/20">
                {SHOW_TABS.map((s, idx) => {
                  const isActiveShow = showTab === s.key && !profileSearch;
                  const count = ALL_PROFILES.filter((p) => p.show === s.key).length;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => handleSelectShow(s)}
                      className={`px-4 py-3 text-left transition-colors ${idx === 0 ? "border-r border-[#1D3C63]/20" : ""
                        } ${isActiveShow
                          ? "bg-[#1D3C63] text-[#FCF686]"
                          : "bg-[#FAF9F4] text-[#1D3C63]/75 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate">
                          {s.label}
                        </span>
                        <span className="print-num text-[10px] opacity-65 shrink-0">
                          {count}명
                        </span>
                      </div>
                      <div className="print-eyebrow text-[9.5px] opacity-60 mt-0.5">
                        {s.en}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 4-Cut Slot Selector Strip (Per-Cut Mode) */}
              {partnerMode === "per-cut" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#1D3C63]/65">
                    <span>
                      바꿀 컷을 선택한 뒤 아래에서 프로필을 눌러주세요 (현재{" "}
                      <strong className="text-[#1D3C63]">CUT 0{activeCutIdx + 1}</strong> 편집 중)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCutPartners(getDefaultCutPartners(showTab));
                        setActiveCutIdx(0);
                      }}
                      className="text-[11px] font-bold text-[#1D3C63] underline underline-offset-2 hover:opacity-75 shrink-0"
                    >
                      배우 전원 기본배치
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {cutPartners.map((cp, idx) => {
                      const isEditing = activeCutIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveCutIdx(idx)}
                          className={`p-1.5 border text-left transition-all flex items-center gap-2 ${isEditing
                            ? "bg-[#FCF686]/65 border-[#1D3C63] ring-1 ring-[#1D3C63]"
                            : "bg-[#FAF9F4] border-[#1D3C63]/16 hover:border-[#1D3C63]/50"
                            }`}
                        >
                          <img
                            src={cp.image}
                            alt={cp.name}
                            className="w-8 h-8 object-cover object-top shrink-0 border border-[#1D3C63]/15"
                          />
                          <div className="min-w-0 leading-tight">
                            <div className="print-num text-[9px] font-bold text-[#1D3C63]/55">
                              CUT 0{idx + 1}
                            </div>
                            <div className="text-[11px] font-bold text-[#1D3C63] truncate">
                              {cp.id === SEMO_POSTER_OPTION.id ? "포스터" : cp.name}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-category Tabs (for selected show) + Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {activeShowConfig.categories.map((c) => {
                    const cCount = ALL_PROFILES.filter((p) => p.category === c.key).length;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => {
                          setProfileTab(c.key);
                          setProfileSearch("");
                        }}
                        className={`px-3 py-1.5 text-[11.5px] border transition-colors ${profileTab === c.key && !profileSearch
                          ? "bg-[#FCF686] border-[#1D3C63] text-[#1D3C63] font-bold"
                          : "bg-white border-[#1D3C63]/16 text-[#1D3C63]/75 hover:border-[#1D3C63]"
                          }`}
                      >
                        {c.label}{" "}
                        <span className="print-num opacity-60">{cCount}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-44 shrink-0">
                  <Search className="w-3.5 h-3.5 text-[#1D3C63]/45 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profileSearch}
                    onChange={(e) => setProfileSearch(e.target.value)}
                    placeholder="전체 이름/파트 검색"
                    className="w-full pl-8 pr-2.5 py-1.5 border border-[#1D3C63]/20 text-xs focus:outline-none focus:border-[#1D3C63]"
                  />
                </div>
              </div>

              {/* Selected Partner Banner */}
              <div className="px-3.5 py-2 bg-[#FAF9F4] border-l-2 border-[#1D3C63] flex items-center justify-between text-xs gap-2">
                <span className="truncate">
                  {partnerMode === "per-cut" ? (
                    <>
                      현재 4컷 구성:{" "}
                      <strong className="text-[#1D3C63]">
                        {cutPartners
                          .map((cp) =>
                            cp.id === SEMO_POSTER_OPTION.id ? "포스터" : cp.name
                          )
                          .join(" · ")}
                      </strong>
                    </>
                  ) : (
                    <>
                      선택된 프로필:{" "}
                      <strong className="text-[#1D3C63]">
                        [{cutPartners[0].groupLabel}] {cutPartners[0].role} {cutPartners[0].name}
                      </strong>
                    </>
                  )}
                </span>
                <span className="print-num text-[#1D3C63]/50 shrink-0">
                  {filteredProfiles.length}개 표시 중
                </span>
              </div>

              {/* Profile Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredProfiles.map((p) => {
                  const active =
                    partnerMode === "per-cut"
                      ? cutPartners[activeCutIdx]?.id === p.id
                      : cutPartners[0]?.id === p.id;
                  const assignedCutNums = cutPartners
                    .map((cp, idx) => (cp.id === p.id ? idx + 1 : null))
                    .filter((n): n is number => n !== null);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPartner(p)}
                      disabled={p.noPhoto}
                      title={p.noPhoto ? "프로필 촬영 전" : undefined}
                      className={`relative overflow-hidden border text-left transition-all ${p.noPhoto
                        ? "border-[#1D3C63]/10 opacity-35 grayscale cursor-not-allowed"
                        : active
                          ? "border-[#1D3C63] ring-2 ring-[#1D3C63]"
                          : assignedCutNums.length > 0 && partnerMode === "per-cut"
                            ? "border-[#1D3C63]/65 opacity-100"
                            : "border-[#1D3C63]/15 opacity-80 hover:opacity-100"
                        }`}
                    >
                      {partnerMode === "per-cut" && assignedCutNums.length > 0 && (
                        <span className="absolute top-1 left-1 z-10 px-1.5 py-0.5 bg-[#1D3C63] text-[#FCF686] print-num text-[9px] font-bold">
                          {assignedCutNums.map((n) => `0${n}`).join("·")}
                        </span>
                      )}
                      <img
                        src={p.image}
                        alt={`${p.role} ${p.name}`}
                        loading="lazy"
                        className="w-full aspect-square object-cover object-top"
                      />
                      <div
                        className={`p-1.5 leading-tight ${active ? "bg-[#1D3C63] text-[#FCF686]" : "bg-[#FAF9F4] text-[#1D3C63]"
                          }`}
                      >
                        <div className="text-[9px] opacity-75 truncate">{p.role}</div>
                        <div className="text-[11px] font-bold truncate">{p.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 02. Frame Theme Picker (Filtered to Selected Profile's Show + MU:BORN Common) */}
          <div className="bg-white border border-[#1D3C63]/16 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b print-rule">
              <div className="flex items-center gap-2.5">
                <span className="print-num text-xs font-bold text-[#1D3C63]">02</span>
                <h2 className="text-sm font-bold text-[#1D3C63]">
                  {showTab === "dinoz" ? "다이노즈" : "세상 모든 이야기의 끝"} 프레임 테마 &amp; 필름 필터
                </h2>
              </div>
              <span className="print-eyebrow text-[#1D3C63]/45">
                {availableThemes.length} EDITIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-l border-[#1D3C63]/16">
              {availableThemes.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setThemeKey(t.key)}
                  className={`p-3.5 border-r border-b border-[#1D3C63]/16 text-left transition-colors ${themeKey === t.key
                    ? "bg-[#FCF686]/50 ring-2 ring-inset ring-[#1D3C63]"
                    : "bg-white hover:bg-[#FAF9F4]"
                    }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: t.swatchA }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: t.swatchB }}
                    />
                  </div>
                  <div className="text-[13px] font-bold text-[#1D3C63]">{t.label}</div>
                  <div className="print-eyebrow text-[9.5px] text-[#1D3C63]/50 mt-0.5">
                    {t.subtitle}
                  </div>
                </button>
              ))}
            </div>

            {/* Filter Selector */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-[#1D3C63]/55 mr-1">필터</span>
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterKey(f.key)}
                  className={`px-3 py-1.5 text-xs border transition-colors ${filterKey === f.key
                    ? "bg-[#1D3C63] border-[#1D3C63] text-[#FCF686] font-bold"
                    : "bg-white border-[#1D3C63]/20 text-[#1D3C63]/75 hover:border-[#1D3C63]"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 03. Capture / Upload */}
          <div className="bg-white border border-[#1D3C63]/16 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b print-rule">
              <span className="print-num text-xs font-bold text-[#1D3C63]">03</span>
              <h2 className="text-sm font-bold text-[#1D3C63]">4컷 사진 촬영 또는 업로드</h2>
            </div>

            {cameraError && (
              <div className="bg-amber-50 border-l-2 border-amber-500 p-3 text-xs text-amber-800">
                {cameraError}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!cameraOn ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1D3C63] text-[#FCF686] text-xs font-bold"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>웹캠 켜기</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={startAutoFourShot}
                    disabled={countdown !== null}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FCF686] text-[#1D3C63] text-xs font-bold border border-[#1D3C63]"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>4컷 자동 촬영 (3초)</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#1D3C63]/30 text-[#1D3C63] text-xs font-bold"
                  >
                    <VideoOff className="w-3.5 h-3.5" />
                    <span>카메라 끄기</span>
                  </button>
                </>
              )}

              <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#1D3C63] hover:bg-[#FCF686] text-[#1D3C63] text-xs font-bold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>사진 4장 업로드</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUploadFiles(e)}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={fillDemoWithCast}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF9F4] hover:bg-[#FCF686] text-[#1D3C63] text-xs font-semibold border border-[#1D3C63]/16"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>미리보기 샘플 채우기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSample(false);
                  setUserPhotos([null, null, null, null]);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[#1D3C63]/65 hover:text-[#1D3C63] text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>초기화</span>
              </button>
            </div>

            {cameraOn && (
              <div className="relative overflow-hidden bg-black aspect-video border border-[#1D3C63]/20">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
                {countdown !== null && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <span className="print-num text-8xl font-bold text-[#FCF686]">{countdown}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF9F4] border border-[#1D3C63]/15 p-2 space-y-2 text-center"
                >
                  <div className="aspect-square overflow-hidden bg-white flex items-center justify-center">
                    {userPhotos[idx] ? (
                      <img
                        src={userPhotos[idx]!}
                        alt={`Cut ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="print-num text-xs font-bold text-[#1D3C63]/35">
                        0{idx + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {cameraOn && (
                      <button
                        type="button"
                        onClick={() => captureSlot(idx)}
                        className="flex-1 py-1 bg-[#FCF686] text-[#1D3C63] text-[10px] font-bold"
                      >
                        촬영
                      </button>
                    )}
                    <label className="flex-1 py-1 bg-[#1D3C63] text-[#FCF686] text-[10px] font-bold cursor-pointer text-center">
                      업로드
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadFiles(e, idx)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Live 4-Cut Strip Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center gap-5">
          <div className="p-4 bg-white border border-[#1D3C63]/16 shadow-sm">
            <canvas ref={canvasRef} className="w-[270px] sm:w-[310px] h-auto" />
          </div>

          {isSample ? (
            <p className="w-full max-w-[344px] text-center text-xs text-[#1D3C63]/60 print-measure">
              미리보기 샘플입니다. 직접 촬영하거나 사진을 올리면 저장할 수 있어요.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleDownload}
              className="w-full max-w-[344px] py-4 bg-[#1D3C63] hover:bg-[#132A47] text-[#FCF686] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>고화질 4컷 이미지 저장하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
