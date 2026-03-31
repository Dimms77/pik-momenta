'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadSession } from '@/lib/storage';
import { getReactionStyle, type RoundResult } from '@/lib/game-logic';

function getLeaderboard(playerName: string, totalScore: number) {
  const base = [
    { name: 'Nova', score: 420 },
    { name: 'Vector', score: 350 },
    { name: 'Pulse', score: 310 }
  ];

  const merged = [...base, { name: playerName, score: totalScore }].sort((a, b) => b.score - a.score);
  return merged.map((item, index) => ({ ...item, place: index + 1 }));
}

export default function SummaryPage() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof loadSession>>(null);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!session) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="card-surface max-w-xl rounded-[2rem] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Итоги не найдены</h1>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Сессия не сохранилась. Вернись на главную и начни заново.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-orange-400/40 bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
          >
            На главную
          </Link>
        </div>
      </main>
    );
  }

  const results = session.results;
  const totalScore = session.totalScore;
  const averageDifference =
    results.length > 0 ? results.reduce((sum, item) => sum + Math.abs(item.difference), 0) / results.length : 0;
  const bestRound = results.reduce<RoundResult | null>((best, current) => {
    if (!best) return current;
    return current.score > best.score ? current : best;
  }, null);
  const leaderboard = getLeaderboard(session.nickname, totalScore);
  const reactionStyle = getReactionStyle(results);

  return (
    <main className="page-shell min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_0.92fr]">
        <section className="card-surface rounded-[2rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Итоги сессии</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Твои результаты</h1>

          <div className="data-grid mt-8">
            <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Общий счёт</div>
              <div className="mt-2 text-2xl font-semibold text-white">{totalScore}</div>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Средняя ошибка</div>
              <div className="mt-2 text-2xl font-semibold text-white">{averageDifference.toFixed(1)} сек</div>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5 md:col-span-2">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Лучший раунд</div>
              <div className="mt-2 text-xl font-semibold text-white">
                {bestRound
                  ? `${bestRound.roundTitle} — ${bestRound.eventType} — ${bestRound.score} очков`
                  : 'Пока нет данных'}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-orange-500/14 to-sky-400/12 p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-white/35">Твой стиль реакции</div>
            <p className="mt-3 text-base leading-8 text-white/78">{reactionStyle}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
            >
              Сменить режим
            </Link>
          </div>
        </section>

        <aside className="card-surface rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Таблица лидеров</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Кто чувствует момент лучше</h2>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/20">
            <div className="grid grid-cols-[80px_1fr_110px] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.25em] text-white/35">
              <div>Место</div>
              <div>Игрок</div>
              <div className="text-right">Очки</div>
            </div>

            {leaderboard.map((item) => {
              const isCurrent = item.name === session.nickname;
              return (
                <div
                  key={`${item.name}-${item.place}`}
                  className={`grid grid-cols-[80px_1fr_110px] gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-none ${
                    isCurrent ? 'bg-orange-500/10' : ''
                  }`}
                >
                  <div className="font-semibold text-white">#{item.place}</div>
                  <div className={isCurrent ? 'font-semibold text-orange-200' : 'text-white/78'}>{item.name}</div>
                  <div className="text-right font-semibold text-white">{item.score}</div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}
