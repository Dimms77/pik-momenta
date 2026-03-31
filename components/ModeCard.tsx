import type { GameMode } from '@/lib/game-data';
import { modeLabels } from '@/lib/game-data';

const descriptions: Record<GameMode, string> = {
  football: 'Лови пик атаки, когда эпизод выходит на решающий удар.',
  esports: 'Отмечай долю секунды, в которой перестрелка ломает исход сцены.'
};

export function ModeCard({
  mode,
  selected,
  onSelect
}: {
  mode: GameMode;
  selected: boolean;
  onSelect: (mode: GameMode) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      className={`card-surface rounded-3xl p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-white/20 ${
        selected ? 'border-orange-400/70 shadow-glow' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm uppercase tracking-[0.3em] text-white/45">Режим</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          {selected ? 'Выбран' : 'Доступен'}
        </span>
      </div>
      <h3 className="text-2xl font-semibold text-white">{modeLabels[mode]}</h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{descriptions[mode]}</p>
    </button>
  );
}
