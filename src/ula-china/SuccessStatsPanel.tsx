import { Award, CheckCircle2, Star, TrendingUp } from "lucide-react";

type SuccessStatsPanelProps = {
  variant?: "default" | "chinese";
};

const SuccessStatsPanel = ({
  variant = "default",
}: SuccessStatsPanelProps) => {
  const isChinese = variant === "chinese";

  const palette = isChinese
    ? {
        accentBorder: "border-red-100",
        cardGlow: "bg-red-200/50",
        gradient: "from-white via-white to-red-50/80",
        shadow: "shadow-[0_24px_60px_-35px_rgba(239,68,68,0.35)]",
        trendTone: "bg-red-50 text-[#ef4444]",
      }
    : {
        accentBorder: "border-blue-100",
        cardGlow: "bg-blue-200/50",
        gradient: "from-white via-white to-blue-50/80",
        shadow: "shadow-[0_24px_60px_-35px_rgba(0,97,171,0.35)]",
        trendTone: "bg-blue-50 text-[#0061ab]",
      };

  const metrics = [
    {
      icon: CheckCircle2,
      value: "10.000+",
      label: "học viên hài lòng",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: TrendingUp,
      value: "96%",
      label: "sẵn sàng giới thiệu",
      tone: palette.trendTone,
    },
    {
      icon: Award,
      value: "2.600+",
      label: "đánh giá 5 sao",
      tone: "bg-amber-50 text-amber-500",
    },
  ];

  const metricGridClassName = isChinese
    ? "grid grid-cols-3 gap-1.5 sm:gap-2 lg:min-w-[420px] lg:max-w-[500px]"
    : "grid gap-2 sm:grid-cols-3 lg:min-w-[420px] lg:max-w-[500px]";

  const metricCardClassName = isChinese
    ? "rounded-[1rem] border border-white/70 bg-white/85 px-2 py-2 shadow-sm backdrop-blur-sm sm:px-3 sm:py-2.5"
    : "rounded-[1.1rem] border border-white/70 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur-sm";

  const metricIconClassName = isChinese
    ? "mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg sm:mb-1.5 sm:h-8 sm:w-8 sm:rounded-xl"
    : "mb-1.5 inline-flex h-8 w-8 items-center justify-center rounded-xl";

  const metricValueClassName = isChinese
    ? "text-[15px] font-black leading-none text-[#1a2b48] sm:text-lg md:text-xl"
    : "text-lg font-black leading-none text-[#1a2b48] md:text-xl";

  const metricLabelClassName = isChinese
    ? "mt-0.5 text-[9px] font-semibold leading-snug text-slate-500 sm:text-[11px] md:text-xs"
    : "mt-0.5 text-[11px] font-semibold leading-snug text-slate-500 md:text-xs";

  return (
    <div
      className={`relative mt-4 overflow-hidden rounded-[1.5rem] border ${palette.accentBorder} bg-gradient-to-br ${palette.gradient} p-3 md:mt-5 md:p-4 ${palette.shadow}`}
    >
      <div
        className={`absolute -right-8 top-0 h-20 w-20 rounded-full ${palette.cardGlow} blur-3xl`}
      />

      <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex flex-col items-center text-center lg:flex-1 lg:justify-center">
          <span className="text-4xl font-black leading-none text-[#c5a059] md:text-5xl">
            4.9
          </span>
          <div className="mt-1 flex justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Từ hơn 2.9K lượt phản hồi gần đây
          </p>

          <p className="mt-1 max-w-lg text-[11px] font-medium leading-snug text-slate-600 md:text-xs">
            Học viên đánh giá cao lộ trình rõ ràng và nhịp học dễ theo mỗi ngày.
          </p>
        </div>

        <div className={metricGridClassName}>
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className={metricCardClassName}
              >
                <div
                  className={`${metricIconClassName} ${metric.tone}`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className={metricValueClassName}>
                  {metric.value}
                </div>
                <p className={metricLabelClassName}>
                  {metric.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuccessStatsPanel;