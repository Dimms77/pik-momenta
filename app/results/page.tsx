'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ResultTimeline } from '@/components/ResultTimeline';
import { loadSession } from '@/lib/storage';
import { formatSeconds, getResultTone, type RoundResult } from '@/lib/game-logic';

function ResultsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof loadSession>>(null);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  const lastRound = useMemo(() => {
    const raw = searchParams.get('lastRound');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as RoundResult;
    } catch {
      return null;
    }
  }, [searchParams]);

  const progress = Number(searchParams.get('progress') || 0);
  const totalRounds = Number(searchParams.get('total') || 0);

  if (!ready) return null;

  if (!session || !lastRound) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="card-surface max-w-xl rounded-[2rem] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Раунд не найден</h1>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Похоже, данные последнего результата потерялись. Вернись на главную и начни сессию заново.
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-6 inline-flex rounded-full border border-orange-400/40 bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
          >
            На главную
          </button>
        </div>
      </main>
    );
  }

  const isFinal = progress >= totalRounds && totalRounds > 0;
  const tone = getResultTone(lastRound);

  const clickPercent = Math.max(
    0,
    Math.min(100, (lastRound.clickedAt / Math.max(lastRound.eventTimestamp + 4, 10)) * 100)
  );
  const eventPercent = Math.max(
    0,
    Math.min(100, (lastRound.eventTimestamp / Math.max(lastRound.eventTimestamp + 4, 10)) * 100)
  );

  return (
    <main className="page-shell min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="card-surface rounded-[2rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Результат раунда</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">{tone.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/68">{tone.text}</p>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-orange-500/10 to-sky-400/10 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Что нужно было поймать</div>
              <div className="mt-2 text-xl font-semibold text-white">{lastRound.eventType}</div>
            </div>

            <div className="data-grid mt-8">
              <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/35">Твой выбор</div>
                <div className="mt-2 text-2xl font-semibold text-white">{formatSeconds(lastRound.clickedAt)}</div>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/35">Реальный момент</div>
                <div className="mt-2 text-2xl font-semibold text-white">{formatSeconds(lastRound.eventTimestamp)}</div>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/35">Разница</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {lastRound.difference > 0 ? '+' : ''}
                  {lastRound.difference.toFixed(1)} сек
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/35">Очки за раунд</div>
                <div className="mt-2 text-2xl font-semibold text-white">+{lastRound.score}</div>
              </div>
            </div>
          </div>

          <div className="card-surface rounded-[2rem] p-6 md:p-8">
            <ResultTimeline clickPercent={clickPercent} eventPercent={eventPercent} />

            <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-sky-400/10 to-orange-500/12 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Как читать результат</div>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Чем ближе твоя отметка к реальному событию, тем выше счёт. Сильный ранний клик — это поспешность,
                сильное опоздание — потеря пика сцены.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {isFinal ? (
                <button
                  type="button"
                  onClick={() => router.push('/summary')}
                  className="rounded-full border border-orange-400/40 bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                >
                  К итогам сессии
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/play?nickname=${encodeURIComponent(session.nickname)}&mode=${session.mode}&round=${progress}`
                    )
                  }
                  className="rounded-full border border-orange-400/40 bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                >
                  Следующий раунд
                </button>
              )}

              <button
                type="button"
                onClick={() => router.push('/')}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
              >
                На главную
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsPageInner />
    </Suspense>
  );
}
