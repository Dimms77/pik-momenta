export function ResultTimeline({ clickPercent, eventPercent }: { clickPercent: number; eventPercent: number }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/45">
        <span>Шкала момента</span>
        <span>Точность попадания</span>
      </div>

      <div className="relative h-5 rounded-full bg-white/10">
        <div
          className="absolute top-1/2 h-8 w-[2px] -translate-y-1/2 rounded-full bg-white/90"
          style={{ left: `${eventPercent}%` }}
        />
        <div
          className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-orange-300 bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.45)]"
          style={{ left: `calc(${clickPercent}% - 12px)` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-orange-400" />
          <span>Твой выбор</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-[2px] bg-white" />
          <span>Реальный пик эпизода</span>
        </div>
      </div>
    </div>
  );
}
