import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type PairItem = {
  de: string;
  vi: string;
  color?: string;
};

type MatchingData = {
  pairs: PairItem[];
};

type Connection = {
  de: string;
  vi: string;
  color: string;
};

type Point = {
  x: number;
  y: number;
};

type PointMap = Record<string, Point | undefined>;

type MatchingExerciseProps = {
  data: MatchingData;
  isChecked?: boolean;
  onResult?: (isAllCorrect: boolean, connections: Connection[]) => void;
};

const DEFAULT_COLOR = '#60a5fa';
const DOT_DIAMETER = 20;
const DOT_RADIUS = DOT_DIAMETER / 2;
const DOT_INSET = 1;

const MatchingExercise = ({ data, isChecked = false, onResult = () => { } }: MatchingExerciseProps) => {
  const [selectedDe, setSelectedDe] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState<PointMap>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const leftDotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightDotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const updateLayout = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const nextPoints: PointMap = {};

    data.pairs.forEach((pair) => {
      const leftDot = leftDotRefs.current[pair.de];
      const rightDot = rightDotRefs.current[pair.vi];

      // Tính chính xác TÂM của dấu chấm bên TRÁI
      if (leftDot) {
        const rect = leftDot.getBoundingClientRect();
        nextPoints[`de:${pair.de}`] = {
          x: (rect.left - containerRect.left) + (rect.width / 2),
          y: (rect.top - containerRect.top) + (rect.height / 2),
        };
      }

      // Tính chính xác TÂM của dấu chấm bên PHẢI
      if (rightDot) {
        const rect = rightDot.getBoundingClientRect();
        nextPoints[`vi:${pair.vi}`] = {
          x: (rect.left - containerRect.left) + (rect.width / 2),
          y: (rect.top - containerRect.top) + (rect.height / 2),
        };
      }
    });

    setContainerSize({ width: containerRect.width, height: containerRect.height });
    setPoints(nextPoints);
  }, [data.pairs]);

  useLayoutEffect(() => {
    updateLayout();
  }, [updateLayout, connections, selectedDe, isChecked]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateLayout();
    });

    observer.observe(container);
    window.addEventListener('resize', updateLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLayout);
    };
  }, [updateLayout]);

  useEffect(() => {
    updateLayout();
  }, [data.pairs, updateLayout]);

  const handleSelect = (type: 'de' | 'vi', value: string) => {
    if (isChecked) return;

    if (type === 'de') {
      const existing = connections.find((c) => c.de === value);
      if (existing) {
        setConnections((prev) => prev.filter((c) => c.de !== value));
        setSelectedDe(null);
        return;
      }
      setSelectedDe(value);
      return;
    }

    if (!selectedDe) return;

    setConnections((prev) => {
      const filtered = prev.filter((c) => c.vi !== value);
      const pairColor = data.pairs.find((p) => p.de === selectedDe)?.color || DEFAULT_COLOR;
      const next = [...filtered, { de: selectedDe, vi: value, color: pairColor }];
      const isAllCorrect =
        next.length === data.pairs.length &&
        next.every((c) => data.pairs.find((p) => p.de === c.de)?.vi === c.vi);

      onResult(isAllCorrect, next);
      return next;
    });

    setSelectedDe(null);
  };

  const lines = useMemo(() => {
    return connections
      .map((conn) => {
        const start = points[`de:${conn.de}`];
        const end = points[`vi:${conn.vi}`];

        if (!start || !end) return null;

        // --- CÔNG THỨC VẼ ĐƯỜNG CONG CHUẨN ---
        const dx = end.x - start.x;
        // Độ võng của dây nối (tùy chỉnh số 0.5 để cong ít hay nhiều, 0.5 là đẹp nhất)
        const controlPointOffset = Math.abs(dx) * 0.5;

        // Giữ nguyên trục Y ở 2 đầu để dây đi ra theo chiều ngang
        const cp1x = start.x + controlPointOffset;
        const cp1y = start.y;

        const cp2x = end.x - controlPointOffset;
        const cp2y = end.y;

        const strokeColor = isChecked
          ? data.pairs.find((p) => p.de === conn.de)?.vi === conn.vi
            ? '#22c55e' // Xanh lá nếu đúng
            : '#ef4444' // Đỏ nếu sai
          : conn.color;

        return {
          key: `${conn.de}-${conn.vi}`,
          d: `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`,
          color: strokeColor,
        };
      })
      .filter(Boolean) as Array<{ key: string; d: string; color: string }>;
  }, [connections, data.pairs, isChecked, points]);

  return (
    <div
      className="relative mx-auto mt-4 w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm"
    >
      <h3 className="mb-12 text-center text-xl font-black uppercase tracking-tight text-[#1a2b48]">
        Ghép các cặp từ với nghĩa tương ứng
      </h3>

      {/* ĐÃ CHUYỂN REF XUỐNG ĐÂY */}
      <div ref={containerRef} className="relative grid grid-cols-[1fr_1fr] gap-x-12 sm:gap-x-24 md:gap-x-32 gap-y-4 md:gap-y-6">
        <div className="relative z-20 flex flex-col gap-6">
          {data.pairs.map((pair) => (
            <div key={pair.de} className="relative flex items-center">
              <button
                onClick={() => handleSelect('de', pair.de)}
                className={`flex-1 rounded-2xl border-2 px-4 py-3 sm:px-8 sm:py-5 text-sm sm:text-lg font-bold transition-all ${selectedDe === pair.de
                  ? 'border-blue-500 bg-blue-50 text-[#1a2b48]'
                  : 'border-slate-200 bg-white text-[#1a2b48]'
                  }`}
              >
                {pair.de}
              </button>
              <div
                ref={(node) => {
                  leftDotRefs.current[pair.de] = node;
                }}
                className={`absolute -right-3 h-5 w-5 rounded-full border-4 border-white bg-slate-200 shadow-md ${connections.some((conn) => conn.de === pair.de) ? 'bg-blue-400' : ''
                  }`}
              />
            </div>
          ))}
        </div>

        <div className="relative z-20 flex flex-col gap-6">
          {data.pairs.map((pair) => (
            <div key={pair.vi} className="relative flex items-center">
              <div
                ref={(node) => {
                  rightDotRefs.current[pair.vi] = node;
                }}
                className={`absolute -left-3 h-5 w-5 rounded-full border-4 border-white bg-slate-200 shadow-md ${connections.some((conn) => conn.vi === pair.vi) ? 'bg-blue-400' : ''
                  }`}
              />
              <button
                onClick={() => handleSelect('vi', pair.vi)}
                className={`flex-1 rounded-2xl border-2 border-dashed px-8 py-5 text-lg font-bold transition-all ${connections.some((conn) => conn.vi === pair.vi)
                  ? 'border-slate-200 bg-white text-[#1a2b48]'
                  : 'border-slate-200 bg-white text-[#1a2b48] hover:border-blue-300'
                  }`}
              >
                {pair.vi}
              </button>
            </div>
          ))}
        </div>

        <svg
          className="pointer-events-none absolute inset-0 z-10 overflow-visible"
          width={containerSize.width}
          height={containerSize.height}
          viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
          preserveAspectRatio="none"
        >
          {lines.map((line) => (
            <g key={line.key} className="transition-all duration-300">
              <path
                d={line.d}
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={line.d}
                fill="none"
                stroke={line.color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 2px 5px rgba(15,23,42,0.14))' }}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default MatchingExercise;
