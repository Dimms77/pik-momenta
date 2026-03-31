'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModeCard } from '@/components/ModeCard';
import type { GameMode } from '@/lib/game-data';
import { loadSession } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [mode, setMode] = useState<GameMode>('football');
  const [error, setError] = useState('');

  useEffect(() => {
    const session = loadSession();

    if (session?.mode) {
      setMode(session.mode);
    }

    if (session?.nickname && session.results.length > 0) {
      setNickname(session.nickname);
    }
  }, []);

  const handleStart = () => {
    const cleanNickname = nickname.trim();

    if (!cleanNickname) {
      setError('Введите ник, чтобы начать сессию.');
      return;
    }

    setError('');
    router.push(`/play?nickname=${encodeURIComponent(cleanNickname)}&mode=${mode}`);
  };

  return (
    <main className="page-shell flex min-h-screen items-center px-4 py-10 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-center rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur md:p-12">
          <div className="mb-6 inline-flex w-fit items-center rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/55">
            Игровой прототип • AI-first MVP
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
            Пик Момента
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/72 md:text-2xl">
            Поймай решающий миг раньше других.
          </p>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
            Смотри короткие спортивные и киберспортивные эпизоды, чувствуй, где сцена выходит на пик,
            и нажимай в ту самую секунду. Здесь побеждает не случайность, а умение читать эпизод.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="card-surface rounded-3xl p-5">
              <div className="text-3xl font-semibold text-white">3</div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                раунда в одной сессии — без лишней затяжки и шума.
              </p>
            </div>
            <div className="card-surface rounded-3xl p-5">
              <div className="text-3xl font-semibold text-white">2</div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                режима: развитие атаки в спорте и вспышка реакции в киберспорте.
              </p>
            </div>
          </div>
        </section>

        <section className="card-surface rounded-[2.2rem] p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Вход в сессию</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Собери свою первую попытку</h2>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/65">
              Русская версия
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm text-white/65">Ваш ник</span>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Например, Dmitry"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none ring-0 transition placeholder:text-white/25 focus:border-orange-400/50"
            />
          </label>

          <div className="mt-6 grid gap-4">
            <ModeCard mode="football" selected={mode === 'football'} onSelect={setMode} />
            <ModeCard mode="esports" selected={mode === 'esports'} onSelect={setMode} />
          </div>

          {error ? <p className="mt-4 text-sm text-orange-300">{error}</p> : null}

          <button
            type="button"
            onClick={handleStart}
            className="mt-6 w-full rounded-full border border-orange-400/40 bg-orange-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-orange-400"
          >
            Начать
          </button>

          <p className="mt-4 text-sm leading-6 text-white/48">
            Сначала ты выбираешь режим, затем проходишь три эпизода подряд и получаешь итог по точности,
            общему счёту и стилю реакции.
          </p>
        </section>
      </div>
    </main>
  );
}
