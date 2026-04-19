import React from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  CreditCard,
  Sparkles,
} from "lucide-react";

const startMarkerIcon = "https://www.ulaedu.com/assets/icon_b%E1%BA%AFt%20%C4%91%E1%BA%A7u-C1Kqht5K.png";
const targetMarkerIcon = "https://www.ulaedu.com/assets/icon%20c%E1%BB%9D%20%C4%91%C3%ADch-DAYHzXAE.png";
const lockedLevelIcon = "https://www.ulaedu.com/assets/icon%20cho%20t%E1%BB%ABng%20level-XmPueJ99.png";
const stepFlagIcon = "https://www.ulaedu.com/assets/icon_c%E1%BB%9D_cho%20t%E1%BB%ABng%20m%E1%BB%91c%20l%E1%BB%99%20tr%C3%ACnh-BcR1hdid.png";

export interface CourseRoadmapLevel {
  id: string;
  label: string;
  sub: string;
}

export interface CourseRoadmapStep {
  id: string;
  title: string;
  desc: string;
  price?: number;
  popup?: unknown;
}

export interface CourseRoadmapAddOnSelection {
  id: string;
  title: string;
  price: number;
}

type CourseRoadmapVariant = "german" | "chinese";

interface CourseRoadmapShowcaseProps {
  variant: CourseRoadmapVariant;
  languageLabel: string;
  currentLevels: CourseRoadmapLevel[];
  targetLevels: CourseRoadmapLevel[];
  currentLevelIdx: number | null;
  targetLevelIdx: number | null;
  roadmapSteps: CourseRoadmapStep[];
  roadmapError: string | null;
  totalPrice: number;
  formatCurrency: (value: number) => string;
  canSelectTargetLevel: (idx: number) => boolean;
  onCurrentLevelChange: (idx: number) => void;
  onTargetLevelChange: (idx: number) => void;
  onStepClick: (step: CourseRoadmapStep) => void;
  onSuggestTarget: () => void;
  onRequestQuote: () => void;
  onSelectedAddOnsChange?: (addOns: CourseRoadmapAddOnSelection[]) => void;
  initialSelectedAddOnIds?: string[];
  expanded: boolean;
  onToggleExpanded: () => void;
}

const SKILL_COMPANION_ENABLED = false;

const splitRoadmapBullets = (desc: string) => {
  const segments = desc
    .split(/,|•|\s-\s| & /)
    .map((item) => item.trim())
    .filter(Boolean);

  return segments.length > 0 ? segments.slice(0, 3) : [desc];
};

const roadmapThemes = {
  german: {
    headingAccent: "bg-gradient-to-r from-[#0b63ce] to-[#38bdf8]",
    levelProgressLine:
      "bg-[linear-gradient(90deg,#e0f2fe_0%,#7dd3fc_42%,#0ea5e9_100%)] shadow-[0_0_10px_rgba(14,165,233,0.34),0_0_22px_rgba(14,165,233,0.18)]",
    activeAuraOuter:
      "bg-[radial-gradient(circle,rgba(246,252,255,0.98)_0%,rgba(186,230,253,0.78)_24%,rgba(56,189,248,0.36)_56%,rgba(56,189,248,0)_80%)]",
    activeAuraMid:
      "bg-[radial-gradient(circle,rgba(255,255,255,0.98)_0%,rgba(224,242,254,0.92)_34%,rgba(125,211,252,0.28)_66%,rgba(125,211,252,0)_84%)]",
    activeAuraInner:
      "bg-[radial-gradient(circle,rgba(255,255,255,0.94)_0%,rgba(240,249,255,0.82)_46%,rgba(56,189,248,0)_86%)]",
    activeMarkerShadow:
      "drop-shadow-[0_0_14px_rgba(14,165,233,0.42)] drop-shadow-[0_0_24px_rgba(14,165,233,0.22)] md:drop-shadow-[0_0_18px_rgba(14,165,233,0.5)] md:drop-shadow-[0_0_28px_rgba(14,165,233,0.28)]",
    activeLabel: "text-[#0b63ce]",
    detailTrackLine: "border-[#38bdf8]",
    detailTrackArrow: "text-[#38bdf8]",
  },
  chinese: {
    headingAccent: "bg-gradient-to-r from-[#0b63ce] to-[#38bdf8]",
    levelProgressLine:
      "bg-[linear-gradient(90deg,#fff7db_0%,#fcd34d_42%,#f59e0b_100%)] shadow-[0_0_10px_rgba(250,204,21,0.34),0_0_22px_rgba(245,158,11,0.18)]",
    activeAuraOuter:
      "bg-[radial-gradient(circle,rgba(255,252,239,0.98)_0%,rgba(253,230,138,0.8)_24%,rgba(251,191,36,0.38)_56%,rgba(251,191,36,0)_80%)]",
    activeAuraMid:
      "bg-[radial-gradient(circle,rgba(255,255,255,0.98)_0%,rgba(254,243,199,0.92)_34%,rgba(252,211,77,0.3)_66%,rgba(252,211,77,0)_84%)]",
    activeAuraInner:
      "bg-[radial-gradient(circle,rgba(255,255,255,0.94)_0%,rgba(255,251,235,0.82)_46%,rgba(253,224,71,0)_86%)]",
    activeMarkerShadow:
      "drop-shadow-[0_0_14px_rgba(250,204,21,0.45)] drop-shadow-[0_0_24px_rgba(245,158,11,0.24)] md:drop-shadow-[0_0_18px_rgba(250,204,21,0.52)] md:drop-shadow-[0_0_28px_rgba(245,158,11,0.3)]",
    activeLabel: "text-[#d97706]",
    detailTrackLine: "border-[#f6ad2f]",
    detailTrackArrow: "text-[#f6ad2f]",
  },
} as const;

type RoadmapTheme = (typeof roadmapThemes)[CourseRoadmapVariant];

const ALL_LEVELS: CourseRoadmapLevel[] = [
  { id: "a0", label: "A0", sub: "Mới bắt đầu" },
  { id: "a1", label: "A1", sub: "Nền tảng" },
  { id: "a2", label: "A2", sub: "Cơ bản" },
  { id: "b1", label: "B1", sub: "Trung cấp" },
  { id: "b2", label: "B2", sub: "Nâng cao" },
  { id: "c1", label: "C1", sub: "Cao cấp" },
];

const MASTER_STEPS_CONTENT: Record<string, CourseRoadmapStep> = {
  a1: { id: "a1", title: "Khởi động A1", desc: "Phát âm chuẩn • Từ vựng cơ bản • Chào hỏi", price: 5500000 },
  a2: { id: "a2", title: "Tăng tốc A2", desc: "Giao tiếp hàng ngày • Ngữ pháp mở rộng • Viết thư", price: 6200000 },
  b1: { id: "b1", title: "Bứt phá B1", desc: "Thảo luận sâu • Thuyết trình • Luyện thi 4 kỹ năng", price: 7800000 },
  b2: { id: "b2", title: "Chuyên sâu B2", desc: "Luyện thi B2 • Văn hóa quốc tế • CV & Phỏng vấn", price: 8800000 },
  c1: { id: "c1", title: "Thành thạo C1", desc: "Ngữ pháp chuyên sâu • Thảo luận học thuật • Làm việc chuyên nghiệp", price: 10500000 },
};

const skillCompanionCards = [
  {
    id: "skill-speaking",
    eyebrow: "Khóa kỹ năng",
    title: "Giao tiếp & Phát âm",
    description: "Tăng phản xạ nghe nói, sửa khẩu hình và ngữ điệu theo các tình huống giao tiếp thực tế.",
    chips: ["Nghe nói", "Phát âm"],
    meta: "Best seller",
  },
  {
    id: "skill-foundation",
    eyebrow: "Khóa kỹ năng",
    title: "Từ vựng & Luyện đề",
    description: "Củng cố vốn từ theo chủ đề và bám sát mục tiêu đầu ra bằng chuỗi bài luyện tinh gọn, có định hướng.",
    chips: ["Từ vựng", "Luyện đề"],
    meta: "Hot course",
  },
];

const selectableSkillAddOns = [
  {
    id: "skill-speaking",
    title: "Giao tiếp & Phát âm",
    points: ["Phản xạ hội thoại", "Sửa phát âm"],
    roadmapDesc: "Phản xạ hội thoại, sửa phát âm, học song song với lộ trình chính",
    price: 1200000,
  },
  {
    id: "skill-foundation",
    title: "Từ vựng & Luyện đề",
    points: ["Từ vựng theo chủ đề", "Bài luyện bám đầu ra"],
    roadmapDesc: "Từ vựng theo chủ đề, bài luyện bám đầu ra, củng cố ngoài giờ",
    price: 1500000,
  },
];

const EMPTY_ADD_ON_IDS: string[] = [];
const EMPTY_SELECTED_ADD_ONS: CourseRoadmapAddOnSelection[] = [];

const LevelTrackPanel: React.FC<{
  title: string;
  levels: CourseRoadmapLevel[];
  activeIdx: number | null;
  theme: RoadmapTheme;
  isTarget?: boolean;
  canSelect?: (idx: number) => boolean;
  onSelect: (idx: number) => void;
}> = ({
  title,
  levels,
  activeIdx,
  theme,
  isTarget = false,
  canSelect,
  onSelect,
}) => {
  const hasActiveLevel = activeIdx !== null && activeIdx >= 0;
  const cellPercent = 100 / Math.max(levels.length, 1);
  const trackInsetPercent = cellPercent / 2;
  const trackWidthPercent = 100 - trackInsetPercent * 2;
  const progressRatio =
    hasActiveLevel && levels.length > 1 ? activeIdx / (levels.length - 1) : 0;
  const progressWidthPercent = trackWidthPercent * progressRatio;

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/60 px-3 py-2.5 shadow-[0_18px_55px_rgba(40,66,120,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl md:px-4 md:py-3">
      <div className="mb-2 flex items-center gap-1.5 text-[#22314d]">
        <img
          src={stepFlagIcon}
          alt=""
          className="h-4 w-4 shrink-0 object-contain"
        />
        <h3 className="text-[11px] font-black uppercase tracking-wide md:text-[13px]">
          {title}
        </h3>
      </div>

      <div className="relative px-1 md:px-2">
        <div
          className="pointer-events-none absolute top-[2.36rem] h-[3px] rounded-full bg-[#d6dde8] md:top-[2.52rem]"
          style={{
            left: `${trackInsetPercent}%`,
            width: `${trackWidthPercent}%`,
          }}
        />
        <div
          className={`pointer-events-none absolute top-[2.36rem] h-[3px] rounded-full transition-[width] duration-300 ease-out md:top-[2.52rem] ${theme.levelProgressLine}`}
          style={{
            left: `${trackInsetPercent}%`,
            width: `${progressWidthPercent}%`,
          }}
        />

        <div
          className="relative grid gap-1.5 md:gap-2.5"
          style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }}
        >
          {levels.map((level, idx) => {
            const active = activeIdx !== null && idx === activeIdx;
            const disabled = isTarget ? !(canSelect?.(idx) ?? true) : false;
            const markerSrc = active
              ? isTarget
                ? targetMarkerIcon
                : startMarkerIcon
              : lockedLevelIcon;

            return (
              <button
                key={level.id}
                type="button"
                onClick={() => {
                  if (disabled) return;
                  onSelect(idx);
                }}
                disabled={disabled}
                title={disabled ? (isTarget ? "Mục tiêu phải cao hơn trình độ hiện tại." : "Không thể chọn") : level.label}
                className={`relative flex flex-col items-center rounded-2xl px-1 py-0.5 transition-all duration-300 ${
                  disabled
                    ? "cursor-not-allowed opacity-40 grayscale-[0.4]"
                    : "cursor-pointer hover:-translate-y-0.5"
                } ${active ? "scale-[1.035]" : ""}`}
              >
                {active && (
                  <>
                    <div className={`absolute left-1/2 top-[-0.2rem] h-[4.55rem] w-[4.55rem] -translate-x-1/2 rounded-full blur-xl md:h-[5rem] md:w-[5rem] ${theme.activeAuraOuter}`} />
                    <div className={`absolute left-1/2 top-[0.22rem] h-[3.35rem] w-[3.35rem] -translate-x-1/2 rounded-full blur-md md:h-[3.6rem] md:w-[3.6rem] ${theme.activeAuraMid}`} />
                    <div className={`absolute left-1/2 top-[0.82rem] h-6 w-6 -translate-x-1/2 rounded-full blur-sm md:top-[0.9rem] md:h-7 md:w-7 ${theme.activeAuraInner}`} />
                  </>
                )}

                <div className="relative z-10 flex h-[3rem] items-end justify-center md:h-[3.45rem]">
                  <img
                    src={markerSrc}
                    alt={level.label}
                    className={`object-contain transition-all duration-300 ${
                      active
                        ? isTarget
                          ? `h-[3rem] w-auto md:h-[3.35rem] ${theme.activeMarkerShadow}`
                          : `h-[3.15rem] w-auto md:h-[3.5rem] ${theme.activeMarkerShadow}`
                        : "h-7 w-7 md:h-8 md:w-8"
                    } ${disabled && !active ? "grayscale-[0.2]" : ""}`}
                  />
                </div>

                <div className="mt-1 text-center">
                  <div
                    className={`font-black uppercase leading-none ${
                      active
                        ? `text-[0.95rem] md:text-[1.12rem] ${theme.activeLabel}`
                        : "text-[0.8rem] text-slate-500 md:text-[0.9rem]"
                    }`}
                  >
                    {level.label}
                  </div>
                  <div className="mt-0.5 text-[8px] font-semibold leading-tight text-slate-400 md:text-[9px]">
                    {level.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CourseRoadmapShowcase: React.FC<CourseRoadmapShowcaseProps> = ({
  variant,
  languageLabel,
  currentLevels,
  targetLevels,
  currentLevelIdx,
  targetLevelIdx,
  roadmapSteps,
  roadmapError,
  totalPrice,
  formatCurrency,
  canSelectTargetLevel,
  onCurrentLevelChange,
  onTargetLevelChange,
  onStepClick,
  onSuggestTarget,
  onRequestQuote,
  onSelectedAddOnsChange,
  initialSelectedAddOnIds = [],
  expanded,
  onToggleExpanded,
}) => {
  const theme = roadmapThemes[variant];
  const hasCurrentSelection = currentLevelIdx !== null;
  const hasTargetSelection = targetLevelIdx !== null;
  const [selectedAddOnIds, setSelectedAddOnIds] = React.useState<string[]>(
    () => (SKILL_COMPANION_ENABLED ? initialSelectedAddOnIds : []),
  );
  const effectiveSelectedAddOnIds = SKILL_COMPANION_ENABLED ? selectedAddOnIds : EMPTY_ADD_ON_IDS;
  const expandedContentRef = React.useRef<HTMLDivElement | null>(null);
  const [expandedContentHeight, setExpandedContentHeight] = React.useState(0);

  const selectedAddOns = React.useMemo<CourseRoadmapAddOnSelection[]>(() => {
    if (effectiveSelectedAddOnIds.length === 0) return EMPTY_SELECTED_ADD_ONS;
    return selectableSkillAddOns
      .filter((card) => effectiveSelectedAddOnIds.includes(card.id))
      .map(({ id, title, price }) => ({ id, title, price }));
  }, [effectiveSelectedAddOnIds]);

  const displayedRoadmapSteps = React.useMemo(() => {
    if (effectiveSelectedAddOnIds.length === 0) return roadmapSteps;
    const addOnSteps = selectableSkillAddOns
      .filter((card) => effectiveSelectedAddOnIds.includes(card.id))
      .map<CourseRoadmapStep>(({ id, title, roadmapDesc, price }) => ({
        id: `addon-${id}`,
        title: `${title} • Gói thêm`,
        desc: roadmapDesc,
        price,
      }));
    const goalIndex = roadmapSteps.findIndex((step) => step.id === "goal");
    if (goalIndex === -1) return [...roadmapSteps, ...addOnSteps];
    return [...roadmapSteps.slice(0, goalIndex), ...addOnSteps, ...roadmapSteps.slice(goalIndex)];
  }, [effectiveSelectedAddOnIds, roadmapSteps]);

  const displayedTotalPrice = React.useMemo(
    () => totalPrice + selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0),
    [selectedAddOns, totalPrice],
  );

  const roadmapCanvasWidth = Math.max(displayedRoadmapSteps.length * 240, 760);

  React.useEffect(() => {
    onSelectedAddOnsChange?.(selectedAddOns);
  }, [onSelectedAddOnsChange, selectedAddOns]);

  React.useEffect(() => {
    const contentNode = expandedContentRef.current;
    if (!contentNode) return;
    const measureHeight = () => setExpandedContentHeight(contentNode.scrollHeight);
    measureHeight();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measureHeight());
    observer.observe(contentNode);
    return () => observer.disconnect();
  }, [displayedRoadmapSteps.length, expanded, roadmapError, selectedAddOns.length]);

  return (
    <section className="relative">
      <div>
        <div className="mb-5">
          <span className="inline-flex items-center rounded-full border border-white/70 bg-white/45 px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#3d5fa0] shadow-sm backdrop-blur-xl">
            Hành Trình Của Bạn
          </span>
          <h2 className="mt-2.5 text-[1.45rem] font-black tracking-tight text-[#22314d] md:text-[2.1rem]">
            Lộ trình học <span className={`${theme.headingAccent} bg-clip-text text-transparent`}>{languageLabel}</span> Tinh gọn
          </h2>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <LevelTrackPanel
            title="Trình độ hiện tại"
            levels={currentLevels}
            activeIdx={currentLevelIdx}
            theme={theme}
            onSelect={onCurrentLevelChange}
          />
          <LevelTrackPanel
            title="Mục tiêu đầu ra"
            levels={targetLevels}
            activeIdx={targetLevelIdx}
            theme={theme}
            isTarget
            canSelect={canSelectTargetLevel}
            onSelect={onTargetLevelChange}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/48 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#22314d] shadow-[0_10px_24px_rgba(80,106,159,0.10),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-xl transition hover:-translate-y-0.5"
          >
            {expanded ? <><ChevronUp className="h-4 w-4" />Thu gọn lộ trình</> : <><ChevronDown className="h-4 w-4" />Xem chi tiết lộ trình</>}
          </button>
          <button
            type="button"
            onClick={onRequestQuote}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[linear-gradient(135deg,rgba(29,59,115,0.92),rgba(37,62,141,0.9),rgba(53,82,177,0.88))] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_rgba(29,59,115,0.32)] backdrop-blur-xl transition hover:-translate-y-0.5"
          >
            <CreditCard className="h-4 w-4" />
            Nhận báo giá lộ trình
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ${expanded ? "mt-7 opacity-100" : "mt-0 opacity-0"}`}
          style={{ maxHeight: expanded ? `${expandedContentHeight}px` : "0px" }}
        >
          <div ref={expandedContentRef}>
            {!hasCurrentSelection || !hasTargetSelection ? (
              <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-white/75 bg-white/44 px-6 py-10 text-center shadow-[0_20px_55px_rgba(59,89,152,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl">
                <AlertCircle className="mb-4 h-12 w-12 text-slate-300" />
                <p className="text-base font-medium text-slate-500">Chọn mục tiêu đầu ra để xem lộ trình chi tiết.</p>
              </div>
            ) : roadmapError ? (
              <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-white/75 bg-white/44 px-6 py-10 text-center shadow-[0_20px_55px_rgba(59,89,152,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl">
                <AlertCircle className="mb-4 h-12 w-12 text-slate-300" /><p className="text-base font-medium text-slate-500">{roadmapError}</p>
                <button type="button" onClick={onSuggestTarget} className="mt-5 rounded-full border border-white/70 bg-white/48 px-5 py-2 text-sm font-black text-[#d7232d] shadow-[0_10px_24px_rgba(80,106,159,0.10)] backdrop-blur-xl transition hover:bg-white/60">Gợi ý mục tiêu phù hợp</button>
              </div>
            ) : (
              <>
                <div className="mt-3 overflow-x-auto pb-4">
                  <div className="relative px-1 pb-2 pt-2 min-w-max md:min-w-[var(--desktop-width)]" style={{ "--desktop-width": `${roadmapCanvasWidth}px` } as React.CSSProperties}>
                    <div className={`pointer-events-none absolute left-[2.5rem] md:left-[3.65rem] right-[1.3rem] top-[2.2rem] md:top-[2.5rem] border-t-[3px] border-dashed ${theme.detailTrackLine} opacity-55`} />
                    <ArrowRight className={`pointer-events-none absolute right-[0.32rem] top-[1.5rem] md:top-[1.8rem] h-6 w-6 ${theme.detailTrackArrow} opacity-60`} strokeWidth={2.6} />

                    <div className="relative flex md:grid items-start gap-3 md:gap-5 md:justify-items-center" style={{ gridTemplateColumns: `repeat(${displayedRoadmapSteps.length}, minmax(220px, 1fr))` }}>
                      {displayedRoadmapSteps.map((step, index) => {
                        const bulletItems = splitRoadmapBullets(step.desc);
                        const isEdgeFlag = index === 0 || index === displayedRoadmapSteps.length - 1;
                        return (
                          <div key={`${step.id}-${index}`} className="relative flex w-[100px] md:w-[236px] max-w-full flex-col items-center shrink-0">
                            <div className="relative z-10 h-[3.2rem] md:h-[3.6rem] w-full">
                              <div className="absolute bottom-[0.35rem] left-1/2 -translate-x-[3.2rem] md:bottom-[0.45rem] md:-translate-x-[5.15rem]">
                                {isEdgeFlag && <><span className={`pointer-events-none absolute left-[56%] top-full h-6 w-12 -translate-x-1/2 -translate-y-[1.08rem] rounded-full blur-[10px] ${theme.activeAuraOuter}`} /><span className={`pointer-events-none absolute left-[56%] top-full h-4 w-9 -translate-x-1/2 -translate-y-[0.94rem] rounded-full blur-[7px] ${theme.activeAuraMid}`} /></>}
                                <img src={stepFlagIcon} alt="" className="relative h-[2.2rem] w-[2.2rem] md:h-[4rem] md:w-[4rem] shrink-0 object-contain drop-shadow-[0_10px_18px_rgba(215,35,45,0.22)]" />
                              </div>
                              <span className="absolute bottom-0 left-1/2 flex h-8 w-8 md:h-11 md:w-11 -translate-x-1/2 items-center justify-center rounded-full border-[2px] md:border-[2.5px] border-[#d7a45b] bg-white text-[1rem] md:text-[1.45rem] font-black text-[#d8322f] shadow-[0_12px_24px_rgba(216,101,67,0.12)]">{index + 1}</span>
                            </div>
                            <div className="group relative mt-2 flex w-[100px] md:w-[188px] min-h-[50px] md:min-h-[124px] flex-col rounded-[1rem] md:rounded-[1.5rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,255,0.84))] px-2 md:px-4 py-4 items-center md:items-start text-center md:text-left shadow-[0_18px_34px_rgba(86,107,155,0.10),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#f0d8bf]">
                              <div className="md:mb-1 flex md:min-h-[1.9rem] items-center justify-center text-center"><h4 className="text-center text-[0.9rem] font-black leading-[1.08] tracking-[-0.01em] text-[#cf2d2d] md:text-[0.98rem]">{step.title}</h4></div>
                              <ul className="hidden md:flex flex-col flex-1 space-y-1 text-[0.82rem] font-semibold leading-[1.28] text-[#6a7282] md:text-[0.88rem]">{bulletItems.map((item) => (<li key={item} className="flex gap-2 text-left"><span className="mt-[0.34rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8f96a3]" /><span>{item}</span></li>))}</ul>
                              {step.price ? <div className="hidden mt-4 md:inline-flex rounded-full border border-[#f2e6da] bg-white/88 px-3 py-1 text-[10px] font-black text-[#d86543] shadow-sm">{formatCurrency(step.price)}</div> : <div className="hidden mt-4 md:inline-flex rounded-full border border-[#e2e8f0] bg-white/88 px-3 py-1 text-[10px] font-black text-[#4866a8] shadow-sm">Chặng đích</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* <div className="mt-7 flex justify-between gap-3 rounded-[2rem] border border-white/80 bg-white/40 py-4 shadow-[0_18px_50px_rgba(46,72,129,0.08),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl md:grid-cols-3 md:px-6">
                  <div className="flex items-center gap-3 px-24">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#4866a8]"><Clock3 className="h-6 w-6" /></div>
                    <div><div className="text-sm font-semibold text-slate-400">Thời gian dự kiến</div><div className="text-xl font-black text-[#22314d]">12 tháng</div></div>
                  </div>
                  <div className="flex items-center gap-3 px-24">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#3a84d8]"><Sparkles className="h-6 w-6" /></div>
                    <div><div className="text-sm font-semibold text-slate-400">Hình thức</div><div className="text-xl font-black text-[#22314d]">Hybrid AI</div></div>
                  </div>

                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Roadmap: React.FC = () => {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [targetIdx, setTargetIdx] = React.useState(1);
  const [expanded, setExpanded] = React.useState(false);

  // Target levels are basically ALL_LEVELS but offset by 1
  const currentLevelsInput = ALL_LEVELS.slice(0, 5); // A0 to B2
  const targetLevelsInput = ALL_LEVELS.slice(1);   // A1 to C1

  const handleCurrentChange = (newIdx: number) => {
    setCurrentIdx(newIdx);
    
    // Get absolute level index
    const levelId = currentLevelsInput[newIdx].id;
    const absNewCurrentIdx = ALL_LEVELS.findIndex(l => l.id === levelId);
    
    // Get absolute target index
    const targetLevelId = targetLevelsInput[targetIdx].id;
    const absTargetIdx = ALL_LEVELS.findIndex(l => l.id === targetLevelId);

    // If current moves ahead or equal to target, bump target
    if (absNewCurrentIdx >= absTargetIdx) {
      const nextTargetId = ALL_LEVELS[absNewCurrentIdx + 1]?.id;
      if (nextTargetId) {
        const newTargetInputIdx = targetLevelsInput.findIndex(l => l.id === nextTargetId);
        if (newTargetInputIdx !== -1) {
          setTargetIdx(newTargetInputIdx);
        }
      }
    }
  };

  const handleTargetChange = (newIdx: number) => {
    setTargetIdx(newIdx);
  };

  const currentLevelId = currentLevelsInput[currentIdx].id;
  const targetLevelId = targetLevelsInput[targetIdx].id;

  const roadmapSteps = React.useMemo(() => {
    const startAbs = ALL_LEVELS.findIndex(l => l.id === currentLevelId);
    const endAbs = ALL_LEVELS.findIndex(l => l.id === targetLevelId);
    
    // Collect steps between current+1 and target
    const steps: CourseRoadmapStep[] = [];
    for (let i = startAbs + 1; i <= endAbs; i++) {
        const levelId = ALL_LEVELS[i].id;
        const baseStep = MASTER_STEPS_CONTENT[levelId];
        if (baseStep) {
            steps.push(baseStep);
        }
    }

    // Add final goal step
    steps.push({
        id: "goal",
        title: "Về đích",
        desc: "Chứng chỉ quốc tế • Sẵn sàng du học/làm việc",
        price: 0
    });

    return steps;
  }, [currentLevelId, targetLevelId]);

  const totalPrice = roadmapSteps.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <div id="roadmap" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <CourseRoadmapShowcase
          variant="german"
          languageLabel="Tiếng Đức"
          currentLevels={currentLevelsInput}
          targetLevels={targetLevelsInput}
          currentLevelIdx={currentIdx}
          targetLevelIdx={targetIdx}
          roadmapSteps={roadmapSteps}
          roadmapError={null}
          totalPrice={totalPrice}
          formatCurrency={(v) => v.toLocaleString("vi-VN") + " đ"}
          canSelectTargetLevel={(idx) => {
              const tid = targetLevelsInput[idx].id;
              const tabs = ALL_LEVELS.findIndex(l => l.id === tid);
              const cabs = ALL_LEVELS.findIndex(l => l.id === currentLevelId);
              return tabs > cabs;
          }}
          onCurrentLevelChange={handleCurrentChange}
          onTargetLevelChange={handleTargetChange}
          onStepClick={() => {}}
          onSuggestTarget={() => {}}
          onRequestQuote={() => {}}
          expanded={expanded}
          onToggleExpanded={() => setExpanded(!expanded)}
        />
      </div>
    </div>
  );
};

export default Roadmap;