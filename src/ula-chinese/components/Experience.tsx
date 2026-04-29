import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Mic, BookOpen, PlayCircle, Volume2, VolumeX, CheckCircle2, XCircle, ArrowRight, RotateCcw, Play, Check, X } from 'lucide-react';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { experienceDefault } from '../pages/admin/adminData';
import { resolveAssetUrl } from '../utils/assetUtil';

// --- DATA BÀI TẬP ĐA DẠNG (TIẾNG TRUNG) ---
const EXERCISES = [
  {
    type: "multiple_choice",
    question: "你好!",
    audioText: "你好!",
    options: ["Tạm biệt", "Xin chào", "Cảm ơn"],
    correct: 1,
    hint: "你好 có nghĩa là Xin chào trong tiếng Trung.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800",
    audio: true,
  },
  {
    type: "match",
    question: "Ghép các cặp từ với nghĩa tương ứng",
    pairs: [
      { id: "p1", left: "谢谢", right: "Cảm ơn" },
      { id: "p2", left: "再见", right: "Tạm biệt" },
      { id: "p3", left: "啤酒", right: "Bia" },
    ],
  },
  {
    type: "fill",
    question: "Điền từ phù hợp vào chỗ trống",
    sentence: "我来自___。",
    correct: "越南",
    hint: "👉 Nghĩa: Tôi đến từ Việt Nam (越南 /Yuènán/)",
  },
  {
    type: "order",
    question: "Sắp xếp các từ thành câu đúng",
    target: "我叫阮文A。",
    words: ["叫", "我", "阮文A。"],
    hint: "👉 Nghĩa: Tôi tên là Nguyễn Văn A.",
  },
  {
    type: "listen",
    question: "🎧 Nghe và chọn nghĩa phù hợp:",
    audioText: "早上好",
    options: ["Chào buổi sáng", "Chào buổi tối", "Tạm biệt"],
    correct: 0,
    hint: "👉 早上好 (Zǎoshang hǎo) là Chào buổi sáng.",
    audio: true,
  },
  {
    type: "multiple_choice",
    question: "Từ '谢谢' tương ứng với?",
    options: ["Chào buổi sáng", "Chúc ngủ ngon", "Cảm ơn bạn"],
    correct: 2,
    hint: "👉 '谢谢' (Xièxie) là lời cảm ơn lịch sự.",
    image: "https://images.unsplash.com/photo-1454165833767-1390e72611da?q=80&w=800",
  },
];

type MatchPair = {
  id?: string;
  left?: string;
  right?: string;
};

type Exercise = {
  type: string;
  question: string;
  audioText?: string;
  options?: string[];
  correct?: number | string;
  hint?: string;
  image?: string;
  audio?: boolean;
  pairs?: MatchPair[];
  sentence?: string;
  target?: string;
  words?: string[];
};

// --- HÀM PHÁT ÂM TTS TIẾNG TRUNG ---
const playTTS = (text: string) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN"; // Set giọng đọc tiếng Trung
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

// --- HIỆU ỨNG PHÁO HOA KHI HOÀN THÀNH ---
const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-[2rem]">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#c5a059"][Math.floor(Math.random() * 5)],
            animation: `fall ${Math.random() * 2 + 2}s linear forwards`,
            animationDelay: `${Math.random() * 1}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// --- COMPONENT MATCHING EXERCISE MỚI (VẼ ĐƯỜNG KẺ) ---
const MatchingExercise = ({
  ex,
  userMatches,
  isChecking,
  matchRightItems,
  selectedLeftId,
  selectedRightId,
  handleSelectLeft,
  handleSelectRight,
}: {
  ex: Exercise;
  userMatches: { left: string; right: string }[];
  isChecking: boolean;
  matchRightItems: MatchPair[];
  selectedLeftId: string | null;
  selectedRightId: string | null;
  handleSelectLeft: (id: string) => void;
  handleSelectRight: (id: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const rightRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [lines, setLines] = useState<{ path: string; color: string }[]>([]);

  const updateLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines = userMatches
      .map((match) => {
        const leftDot = leftRefs.current[match.left];
        const rightDot = rightRefs.current[match.right];

        if (leftDot && rightDot) {
          const leftRect = leftDot.getBoundingClientRect();
          const rightRect = rightDot.getBoundingClientRect();

          let strokeColor = "#0061ab";
          if (isChecking) {
            const isCorrectMatch = ex.pairs?.some(p => p.left === match.left && p.right === match.right);
            strokeColor = isCorrectMatch ? "#22c55e" : "#ef4444";
          }

          const x1 = leftRect.left + leftRect.width / 2 - containerRect.left;
          const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
          const x2 = rightRect.left + rightRect.width / 2 - containerRect.left;
          const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

          const offset = Math.abs(x2 - x1) / 2;
          const path = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;

          return { path, color: strokeColor };
        }
        return null;
      })
      .filter(Boolean) as { path: string; color: string }[];

    setLines(newLines);
  }, [userMatches, isChecking, ex]);

  useEffect(() => {
    updateLines();
    const t1 = setTimeout(updateLines, 50);
    const t2 = setTimeout(updateLines, 200);
    const t3 = setTimeout(updateLines, 500);

    window.addEventListener("resize", updateLines);
    window.addEventListener("scroll", updateLines, true);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateLines);
      window.removeEventListener("scroll", updateLines, true);
    };
  }, [updateLines, ex]);

  return (
    <div className="w-full bg-white/50 backdrop-blur-md text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl select-none relative">
      <h3 className="text-lg font-black uppercase mb-6 border-b pb-4 text-center">
        {ex.question}
      </h3>

      <div
        ref={containerRef}
        className="grid grid-cols-2 gap-12 md:gap-32 relative min-h-[300px]"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          {lines.map((line, idx) => (
            <path
              key={idx}
              d={line.path}
              stroke={line.color}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="animate-in fade-in duration-300 drop-shadow-sm"
            />
          ))}
        </svg>

        <div className="space-y-4 relative z-20 flex flex-col justify-center">
          {ex.pairs?.map((item, index) => {
            const leftText = item.left || '';
            const isSelected = selectedLeftId === leftText;
            const match = userMatches.find((m) => m.left === leftText);
            let statusClass = "border-slate-200 bg-white hover:border-blue-200";

            if (isChecking) {
              const isCorrectMatch = ex.pairs?.some(p => p.left === match?.left && p.right === match?.right);
              if (match && isCorrectMatch)
                statusClass = "border-green-500 bg-green-50 text-green-700";
              else if (match) statusClass = "border-red-400 bg-red-50 text-red-700";
            } else if (isSelected)
              statusClass = "border-[#0061ab] ring-2 ring-[#0061ab] bg-blue-50";
            else if (match)
              statusClass = "border-[#0061ab] bg-slate-50 opacity-90";

            return (
              <button
                type="button"
                key={`left-${index}`}
                onClick={() => handleSelectLeft(leftText)}
                disabled={isChecking}
                className={`w-full min-h-[60px] p-3 rounded-xl border-2 text-center font-bold text-sm md:text-lg transition-all overflow-visible relative shadow-sm ${statusClass}`}
              >
                {leftText}
                <div
                  ref={(el) => {
                    leftRefs.current[leftText] = el;
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 rounded-full translate-x-1/2 border-2 border-white shadow-sm z-30 flex items-center justify-center"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isSelected || match ? "bg-[#0061ab]" : "bg-transparent"}`}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-4 relative z-20 flex flex-col justify-center">
          {matchRightItems?.map((item, index) => {
            const rightText = item.right || '';
            const isSelected = selectedRightId === rightText;
            const match = userMatches.find((m) => m.right === rightText);
            let statusClass = "border-slate-200 border-dashed bg-white hover:border-blue-200";

            if (isChecking) {
              const isCorrectMatch = ex.pairs?.some(p => p.left === match?.left && p.right === match?.right);
              if (match && isCorrectMatch)
                statusClass = "border-green-500 border-solid bg-green-50 text-green-700";
              else if (match) statusClass = "border-red-400 border-solid bg-red-50 text-red-700";
            } else if (isSelected)
              statusClass = "border-[#c5a059] border-solid ring-2 ring-[#c5a059] bg-yellow-50";
            else if (match)
              statusClass = "border-[#0061ab] border-solid bg-slate-50 opacity-90";

            return (
              <button
                type="button"
                key={`right-${index}`}
                onClick={() => handleSelectRight(rightText)}
                disabled={isChecking}
                className={`w-full min-h-[60px] p-3 rounded-xl border-2 text-center font-bold text-sm md:text-lg transition-all overflow-visible relative shadow-sm ${statusClass}`}
              >
                <div
                  ref={(el) => {
                    rightRefs.current[rightText] = el;
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 rounded-full -translate-x-1/2 border-2 border-white shadow-sm z-30 flex items-center justify-center"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isSelected || match ? "bg-[#0061ab]" : "bg-transparent"}`}
                  ></div>
                </div>
                {rightText}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// --- HÀM XỬ LÝ VIDEO VIMEO ---
const transformVimeoUrl = (url: string) => {
  if (!url) return '';
  let trimmed = url.trim();

  if (trimmed.includes('vimeo.com') && !trimmed.includes('player.vimeo.com')) {
    const parts = trimmed.split('vimeo.com/');
    if (parts[1]) {
      const id = parts[1].split('?')[0];
      trimmed = `https://player.vimeo.com/video/${id}`;
    }
  }

  const separator = trimmed.includes('?') ? '&' : '?';
  return `${trimmed}${separator}autoplay=1&muted=0&controls=0&badge=0&autopause=0&vimeo_logo=0&dnt=1`;
};

// --- CẬP NHẬT COMPONENT VIDEO ĐỂ HỖ TRỢ TẮT ÂM THANH ---
function SlimVimeoPlayer({ videoUrl, title, onProgress, onDuration, isPaused, seekTo, isMuted }: any) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (iframeRef.current && (window as any).Vimeo) {
        const player = new (window as any).Vimeo.Player(iframeRef.current);
        playerRef.current = player;
        player.on("timeupdate", (data: any) => onProgress?.(data.seconds));
        player.on("loaded", () => {
          player.getDuration().then((duration: number) => onDuration?.(duration));
          // Set âm lượng ban đầu
          if (isMuted !== undefined) {
            player.setVolume(isMuted ? 0 : 1);
          }
        });
      }
    };

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [onProgress, onDuration]);

  useEffect(() => {
    if (playerRef.current) {
      isPaused ? playerRef.current.pause() : playerRef.current.play();
    }
  }, [isPaused]);

  useEffect(() => {
    if (playerRef.current && seekTo !== null && seekTo !== undefined) {
      playerRef.current.setCurrentTime(seekTo);
    }
  }, [seekTo]);

  // Theo dõi biến Muted
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : 1);
    }
  }, [isMuted]);

  return (
    <iframe
      ref={iframeRef}
      src={transformVimeoUrl(videoUrl)}
      title={title}
      className="absolute inset-0 h-full w-full scale-[1.05] bg-black"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}

const Experience = () => {
  const { content, isLoading } = useLandingSection(ADMIN_SECTION_KEYS.experience, experienceDefault);
  const [activeTab, setActiveTab] = useState<'pronounce' | 'quiz' | 'video'>('quiz');

  // --- STATE CHO BÀI TẬP MỚI ---
  const [currentEx, setCurrentEx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [orderedWords, setOrderedWords] = useState<{ id: string; text: string }[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: string; text: string }[]>([]);
  const [fillAnswer, setFillAnswer] = useState("");
  const [userMatches, setUserMatches] = useState<{ left: string; right: string }[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // --- STATE CHO VIDEO CHUẨN ---
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // <--- THÊM BIẾN TẮT TIẾNG
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (clientX: number) => {
    if (progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const width = rect.width;
      const newTime = Math.max(0, Math.min(duration, (x / width) * duration));
      setCurrentTime(newTime);
      setSeekTo(newTime);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSeek(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleSeek(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleSeek(e.touches[0].clientX);
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setTimeout(() => setSeekTo(null), 100);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, duration]);

  const handleMouseEnterVideo = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
  };

  const handleMouseLeaveVideo = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const toggleControls = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(!showControls);
  };

  // --- CÁC HÀM XỬ LÝ BÀI TẬP ---
  useEffect(() => {
    const ex = EXERCISES[currentEx] as Exercise;
    if (ex?.type === "order" && ex.words) {
      setAvailableWords(ex.words.map((w, i) => ({ id: String(i), text: w })));
    } else {
      setAvailableWords([]);
    }
  }, [currentEx]);

  const matchRightItems = useMemo(() => {
    if (EXERCISES[currentEx]?.type === "match") {
      return [...(EXERCISES[currentEx].pairs ?? [])].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [currentEx]);

  const playSound = (correct: boolean) => {
    try {
      const audio = new Audio(
        correct
          ? "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"
          : "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3",
      );
      audio.volume = 0.5;
      audio.play().catch(() => undefined);
    } catch { }
  };

  const resetExState = (nextIndex = currentEx) => {
    setSelectedOpt(null);
    setFillAnswer("");
    setUserMatches([]);
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setOrderedWords([]);
    setIsChecking(false);
    setIsCorrect(null);

    const ex = EXERCISES[nextIndex] as Exercise;
    if (ex?.type === "order" && ex.words) {
      setAvailableWords(ex.words.map((w, i) => ({ id: String(i), text: w })));
    } else {
      setAvailableWords([]);
    }
  };

  const handleMatch = (leftId: string, rightId: string) => {
    setUserMatches((prev) => {
      const clean = prev.filter((m) => m.left !== leftId && m.right !== rightId);
      return [...clean, { left: leftId, right: rightId }];
    });
    setSelectedLeftId(null);
    setSelectedRightId(null);
  };

  const handleSelectLeft = (id: string) => {
    if (isChecking) return;
    if (userMatches.some((m) => m.left === id))
      setUserMatches((prev) => prev.filter((m) => m.left !== id));
    if (selectedRightId) handleMatch(id, selectedRightId);
    else setSelectedLeftId(selectedLeftId === id ? null : id);
  };

  const handleSelectRight = (id: string) => {
    if (isChecking) return;
    if (userMatches.some((m) => m.right === id))
      setUserMatches((prev) => prev.filter((m) => m.right !== id));
    if (selectedLeftId) handleMatch(selectedLeftId, id);
    else setSelectedRightId(selectedRightId === id ? null : id);
  };

  const handleCheckAnswer = () => {
    setIsChecking(true);
    const ex = EXERCISES[currentEx] as Exercise;
    let correct = false;

    if (
      ex.type === "multiple_choice" ||
      ex.type === "listen" ||
      ex.type === "mcq" ||
      ex.type === "mcq_sentence"
    ) {
      correct = selectedOpt === ex.correct;
    } else if (ex.type === "order") {
      correct = orderedWords.map((w) => w.text).join(" ") === ex.target;
    } else if (ex.type === "match") {
      if (ex.pairs) {
        correct =
          userMatches.length === ex.pairs.length &&
          userMatches.every((m) => ex.pairs?.some(p => p.left === m.left && p.right === m.right));
      }
    } else if (ex.type === "fill") {
      correct = String(fillAnswer).trim().toLowerCase() === String(ex.correct).toLowerCase();
    }

    setIsCorrect(correct);
    playSound(correct);
  };

  const handleNextExercise = () => {
    if (currentEx < EXERCISES.length - 1) {
      const nextIdx = currentEx + 1;
      setCurrentEx(nextIdx);
      resetExState(nextIdx);
    } else {
      setIsCompleted(true);
      playSound(true);
    }
  };

  const renderExerciseContent = () => {
    const ex = EXERCISES[currentEx] as Exercise;

    if (
      ex.type === "multiple_choice" ||
      ex.type === "listen" ||
      ex.type === "mcq" ||
      ex.type === "mcq_sentence"
    ) {
      return (
        <div className="w-full flex flex-col md:flex-row gap-6 items-stretch bg-white/30 backdrop-blur-md text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl">
          {(ex.image || ex.audio) && (
            <div className="w-full md:w-5/12 flex-shrink-0 flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100 relative">

              {ex.image && (
                <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-auto md:h-full p-2">
                  <img
                    src={ex.image}
                    alt="exercise hint"
                    className="absolute inset-0 w-full h-full object-contain object-center rounded-md drop-shadow-[0_12px_24px_rgba(26,43,72,0.14)]"
                  />

                  {ex.audio && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTTS(ex.audioText || ex.question);
                      }}
                      className="absolute inset-0 m-auto w-10 h-10 sm:w-12 sm:h-12 bg-[#0061ab]/90 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition backdrop-blur-sm"
                    >
                      <Volume2 size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  )}
                </div>
              )}

              {!ex.image && ex.audio && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playTTS(ex.audioText || ex.question);
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0061ab] text-white rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg"
                >
                  <Volume2 size={28} className="sm:w-9 sm:h-9" />
                </button>
              )}
            </div>
          )}

          <div className="w-full flex-1 flex flex-col justify-center">
            <h4 className="font-black text-[#1a2b48] text-lg md:text-xl mb-4 whitespace-pre-line">
              {ex.question}
            </h4>
            <div className={`grid ${ex.options && ex.options.length > 2 ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
              {ex.options?.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                let btnClass = "border-slate-200 bg-white hover:bg-slate-50";
                if (isChecking) {
                  if (idx === ex.correct)
                    btnClass = "border-green-500 bg-green-50 text-green-700";
                  else if (isSelected)
                    btnClass = "border-red-500 bg-red-50 text-red-700";
                } else if (isSelected)
                  btnClass = "border-[#ef4444] bg-blue-50 ring-1 ring-[#ef4444]";

                const displayOpt = opt.startsWith("A.") || opt.startsWith("B.") || opt.startsWith("C.") ? opt.substring(3) : opt;

                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => !isChecking && setSelectedOpt(idx)}
                    disabled={isChecking}
                    className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center gap-3 ${btnClass}`}
                  >
                    <span className={`w-7 h-7 rounded flex items-center justify-center text-xs shrink-0 ${isSelected && !isChecking ? "bg-[#ef4444] text-white" : "bg-slate-100 text-slate-500"}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {displayOpt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (ex.type === "match") {
      return (
        <MatchingExercise
          ex={ex}
          userMatches={userMatches}
          isChecking={isChecking}
          matchRightItems={matchRightItems}
          selectedLeftId={selectedLeftId}
          selectedRightId={selectedRightId}
          handleSelectLeft={handleSelectLeft}
          handleSelectRight={handleSelectRight}
        />
      );
    }

    if (ex.type === "order") {
      return (
        <div className="w-full bg-white/30 backdrop-blur-md text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl">
          <h3 className="text-lg font-black uppercase mb-2">Sắp xếp câu</h3>
          <p className="text-slate-500 font-medium text-sm mb-6 border-b pb-4">
            {ex.question}
          </p>
          <div className="min-h-[80px] bg-slate-50 p-4 md:p-6 rounded-2xl flex flex-wrap gap-2 md:gap-3 mb-4 border-2 border-dashed border-slate-300 items-center justify-center shadow-inner">
            {orderedWords.length === 0 && (
              <span className="text-slate-400 text-sm font-medium">Bấm vào từ bên dưới để ghép câu...</span>
            )}
            {orderedWords.map((w, idx) => (
              <button
                type="button"
                key={idx}
                disabled={isChecking}
                onClick={() => {
                  setOrderedWords(orderedWords.filter((_, i) => i !== idx));
                  setAvailableWords([...availableWords, w]);
                  setIsChecking(false);
                  setIsCorrect(null);
                }}
                className="bg-[#0061ab] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors animate-in zoom-in duration-200"
              >
                {w.text}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center border-t border-slate-100 pt-6">
            {availableWords.map((w, idx) => (
              <button
                type="button"
                key={idx}
                disabled={isChecking}
                onClick={() => {
                  setAvailableWords(availableWords.filter((_, i) => i !== idx));
                  setOrderedWords([...orderedWords, w]);
                  setIsChecking(false);
                  setIsCorrect(null);
                }}
                className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:border-[#0061ab] hover:text-[#0061ab] transition-all hover:-translate-y-1"
              >
                {w.text}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (ex.type === "fill") {
      const sentenceParts = (ex.sentence || "").split("___");
      return (
        <div className="w-full bg-white/30 backdrop-blur-md text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl">
          <h3 className="text-lg font-black uppercase mb-6 border-b pb-4 whitespace-pre-line">
            {ex.question}
          </h3>

          <div className="text-xl font-medium flex items-center flex-wrap gap-2 leading-loose text-center justify-center my-8">
            {sentenceParts.map((part, i) => (
              <React.Fragment key={i}>
                <span>{part}</span>
                {i < sentenceParts.length - 1 && (
                  <input
                    type="text"
                    value={fillAnswer}
                    onChange={(e) => {
                      setFillAnswer(e.target.value);
                      setIsChecking(false);
                      setIsCorrect(null);
                    }}
                    disabled={isChecking}
                    className={`mx-2 px-3 py-1 border-b-2 rounded-lg outline-none w-32 text-center transition-colors ${isChecking ? (isCorrect ? "border-green-500 text-green-600 bg-green-50 rounded-lg" : "border-red-500 text-red-600 bg-red-50 rounded-lg") : "border-[#dfc38a] focus:border-[#1a2b48]"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {ex.hint && (
            <p className="text-sm text-slate-500 mt-6 italic text-center">
              {ex.hint}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-48 bg-slate-200 rounded-2xl"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-xl"></div>
        </div>
      </section>
    );
  }

  const { sectionTitle, sectionSubtitle } = content;

  return (
    <section id="experience" className="flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden reveal">
      {/* 1. Header */}
      <div className="text-center mb-10 relative z-10 animate-fade-in-up">
        <h2 className="text-xl md:text-[16px] font-extrabold text-[#1a2b48] uppercase tracking-[0.2em] mt-10 whitespace-pre-line">{sectionTitle}</h2>
        <h3 className="text-xl md:text-4xl font-bold text-[#b59449] italic mt-1">{sectionSubtitle}</h3>
      </div>

      {/* 2. Tabs */}
      <div className="grid grid-cols-2 gap-3 md:flex md:justify-center bg-white/30 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white mb-8 md:mb-12 z-20 relative">
        <button onClick={() => setActiveTab('pronounce')} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'pronounce' ? 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white shadow-md' : 'text-slate-500'}`}>
          <Mic size={14} /> AI sửa phát âm
        </button>
        <button onClick={() => setActiveTab('quiz')} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white shadow-md' : 'text-slate-500'}`}>
          <BookOpen size={14} /> Demo bài tập
        </button>
        <button onClick={() => { setActiveTab('video'); setIsPlayingVideo(false); }} className={`col-span-2 mx-auto w-fit flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'video' ? 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white shadow-md' : 'text-slate-500'}`}>
          <PlayCircle size={14} /> Video học thử
        </button>
      </div>

      {/* 3. Main Content Container */}
      <div className="w-full max-w-5xl bg-white/30 backdrop-blur-2xl rounded-[32px] md:rounded-[40px] overflow-hidden min-h-[50px] md:min-h-[600px] flex flex-col relative z-10 reveal shadow-xl border border-white/50">

        {/* NỘI DUNG BÀI TẬP */}
        {activeTab === 'quiz' && (
          <>
            {isCompleted ? (
              <div className="animate-in zoom-in flex flex-col items-center justify-center h-full min-h-[500px] text-center p-8">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Check size={40} strokeWidth={4} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-[#1a2b48] mb-2">Đã hoàn thành!</h3>
                <p className="text-slate-500 font-medium text-sm md:text-base mb-8">Thật dễ dàng đúng không? Học tiếng Trung không hề khó khi có lộ trình chuẩn.</p>
                <button onClick={() => { setIsCompleted(false); setCurrentEx(0); resetExState(0); }} className="bg-[#0061ab] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2">
                  <RotateCcw size={18} /> Làm lại từ đầu
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in relative p-6 md:p-12 min-h-[500px]">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-bold text-[#0061ab] bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full">
                    Câu hỏi {currentEx + 1}/{EXERCISES.length}
                  </span>
                  <div className="flex gap-1.5">
                    {EXERCISES.map((_, i) => (
                      <div key={i} className={`w-8 md:w-12 h-2 rounded-full transition-colors ${i <= currentEx ? 'bg-[#0061ab] shadow-sm' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-center mb-8">
                  {renderExerciseContent()}
                </div>

                <div className="mt-auto border-t border-slate-200/60 pt-6 flex flex-col items-center">
                  {!isChecking ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={
                        (EXERCISES[currentEx].type === "order" && orderedWords.length === 0) ||
                        (EXERCISES[currentEx].type === "multiple_choice" && selectedOpt === null) ||
                        (EXERCISES[currentEx].type === "listen" && selectedOpt === null) ||
                        (EXERCISES[currentEx].type === "mcq_sentence" && selectedOpt === null) ||
                        (EXERCISES[currentEx].type === "mcq" && selectedOpt === null) ||
                        (EXERCISES[currentEx].type === "match" &&
                          userMatches.length !== EXERCISES[currentEx].pairs?.length) ||
                        (EXERCISES[currentEx].type === "fill" && fillAnswer.trim() === "")
                      }
                      className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs md:text-sm transition-all w-full md:w-auto flex justify-center items-center gap-2 
                          ${(EXERCISES[currentEx].type === "order" && orderedWords.length > 0) ||
                          (EXERCISES[currentEx].type === "match" &&
                            userMatches.length === EXERCISES[currentEx].pairs?.length) ||
                          (EXERCISES[currentEx].type === "multiple_choice" && selectedOpt !== null) ||
                          (EXERCISES[currentEx].type === "listen" && selectedOpt !== null) ||
                          (EXERCISES[currentEx].type === "mcq" && selectedOpt !== null) ||
                          (EXERCISES[currentEx].type === "mcq_sentence" && selectedOpt !== null) ||
                          (EXERCISES[currentEx].type === "fill" && fillAnswer.trim() !== "")
                          ? "bg-[#ef4444] text-white cursor-pointer hover:shadow-lg hover:-translate-y-1"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                      Kiểm tra kết quả
                    </button>
                  ) : (
                    <div className="w-full animate-in slide-in-from-bottom-4">
                      {isCorrect ? (
                        <div className="bg-green-50 border border-green-200 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-4 text-left w-full">
                            <div className="w-12 h-12 bg-white text-green-500 border border-green-100 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                              <CheckCircle2 size={24} />
                            </div>
                            <div>
                              <p className="font-black text-green-800 text-base md:text-lg mb-1">Chính xác tuyệt đối!</p>
                              <p className="text-green-700 text-sm font-medium">{EXERCISES[currentEx].hint || "Bạn đã trả lời đúng."}</p>
                            </div>
                          </div>
                          <button onClick={handleNextExercise} className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
                            Tiếp tục <ArrowRight size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-4 text-left w-full">
                            <div className="w-12 h-12 bg-white text-red-500 border border-red-100 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                              <XCircle size={24} />
                            </div>
                            <div>
                              <p className="font-black text-red-800 text-base md:text-lg mb-1">Chưa chính xác mất rồi</p>
                              <p className="text-red-700 text-sm font-medium">Hãy thử suy nghĩ lại một chút xem sao nhé!</p>
                            </div>
                          </div>
                          <button onClick={() => setIsChecking(false)} className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
                            <RotateCcw size={18} /> Thử lại
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* NỘI DUNG TAB: VIDEO CHUẨN CÓ THANH ĐIỀU KHIỂN */}
        {activeTab === 'video' && (
          <div className="p-4 md:p-14 flex-grow flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl aspect-video relative group animate-zoom-in">
              <div
                className="relative h-full w-full rounded-[1.5rem] md:rounded-[3rem] border-4 md:border-[12px] border-white bg-slate-900 shadow-2xl overflow-hidden"
                onMouseEnter={handleMouseEnterVideo}
                onMouseLeave={handleMouseLeaveVideo}
              >
                {isPlayingVideo ? (
                  <>
                    <SlimVimeoPlayer
                      videoUrl="https://player.vimeo.com/video/1176153399?h=09b018576d"
                      title="Video học thử"
                      onProgress={setCurrentTime}
                      onDuration={setDuration}
                      isPaused={isPaused}
                      seekTo={seekTo}
                      isMuted={isMuted} // Thêm Muted
                    />
                    <div className="absolute inset-0 z-10 cursor-pointer" onClick={toggleControls} />

                    <div className={`absolute inset-x-4 bottom-2.5 md:inset-x-8 md:bottom-4 z-20 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                      <div className="mx-auto w-[95%] md:w-[75%] bg-white/95 rounded-full px-4 py-1.5 md:px-6 md:py-2.5 flex items-center justify-between gap-3 md:gap-5 shadow-xl backdrop-blur-md h-12" onClick={(e) => e.stopPropagation()}>

                        <button onClick={() => setIsPaused(!isPaused)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100/80 text-slate-800 hover:bg-slate-200 transition-colors">
                          {isPaused ? <Play className="h-4 w-4 fill-current ml-0.5" /> : <div className="flex gap-1"><div className="h-3 w-0.5 bg-current rounded-full" /><div className="h-3 w-0.5 bg-current rounded-full" /></div>}
                        </button>

                        <div className="hidden md:flex shrink-0 items-center gap-1.5 text-xs font-bold text-slate-600 tabular-nums">
                          <span>{formatTime(currentTime)}</span>
                          <span className="text-slate-300">/</span>
                          <span>{formatTime(duration)}</span>
                        </div>

                        <div ref={progressBarRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} className="relative flex-grow h-1.5 bg-slate-200 rounded-full cursor-pointer group/progress touch-none">
                          <div className="absolute inset-y-0 left-0 bg-[#0061ab] rounded-full transition-all duration-100" style={{ width: `${progressPercent}%` }} />
                          <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a2b48] shadow-md border-2 border-white transition-all group-hover/progress:scale-125" style={{ left: `${progressPercent}%` }} />
                        </div>

                        <button onClick={() => setIsMuted(!isMuted)} className="flex shrink-0 items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                    <img src="/src/assets/video_experience_thumbnail.png" className="w-full h-full object-cover opacity-80" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/20 transition-colors">
                      <PlayCircle size={80} className="text-white opacity-90 shadow-2xl animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NỘI DUNG TAB: AI PHÁT ÂM */}
        {activeTab === 'pronounce' && (
          <div className="p-4 sm:p-6 md:p-10 lg:p-14 flex-grow flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-auto md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border-2 sm:border-4 border-white bg-slate-50">
                {typeof content.aiPronunciationImageUrl === 'string' && content.aiPronunciationImageUrl.trim() ? (
                  <img src={resolveAssetUrl(content.aiPronunciationImageUrl)} alt="AI" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-slate-400 font-semibold">Chưa có ảnh mô phỏng AI</span></div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Experience;