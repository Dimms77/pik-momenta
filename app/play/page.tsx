'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VideoStage } from '@/components/VideoStage';
import { getRoundsByMode, modeLabels, type GameMode } from '@/lib/game-data';
import { calculateScore, type RoundResult } from '@/lib/game-logic';
import { loadSession, saveSession } from '@/lib/storage';

function PlayPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nickname = searchParams.get('nickname')?.trim() || '';
  const modeParam = searchParams.get('mode');
  const mode: GameMode = modeParam === 'esports' ? 'esports' : 'football';
  const roundParam = Number(searchParams.get('round') || '0');
  const safeRoundParam = Number.isFinite(roundParam) && roundParam >= 0 ? roundParam : 0;

  const modeRounds = useMemo(() => getRoundsByMode(mode), [mode]);
  const [roundIndex, setRoundIndex] = useState(safeRoundParam);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [locked, setLocked] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (!nickname) {
      router.replace('/');
    }
  }, [nickname, router]);

  useEffect(() => {
    const session = loadSession();

    if (session && session.nickname === nickname && session.mode === mode) {
      setResults(session.results || []);
    } else {
      setResults([]);
      if (nickname) {
        saveSession({ nickname, mode, results: [], totalScore: 0 });
      }
    }

    setRoundIndex(safeRoundParam);
    setLocked(false);
    setBootstrapped(true);
  }, [nickname, mode, safeRoundParam]);

  const currentRound = modeRounds[roundIndex];
  const totalScore = results.reduce((sum, item) => sum + item.score, 0);

  if (!nickname || !bootstrapped || !currentRound) {
    return null;
  }

  const handleCatchMoment = (clickedAt: number) => {
    if (locked) return;

    const difference = Number((clickedAt - currentRound.eventTimestamp).toFixed(2));
    const score = calculateScore(mode, difference);

    const nextResult: RoundResult = {
      roundId: currentRound.id,
      mode,
      roundTitle: currentRound.title,
      eventType: currentRound.eventType,
      clickedAt,
      eventTimestamp: currentRound.eventTimestamp,
      difference,
      score,
      validAttempt: true
    };

    const nextResults = [...results, nextResult];
    const nextTotal = nextResults.reduce((sum, item) => sum + item.score, 0);

    saveSession({
      nickname,
      mode,
      results: nextResults,
      totalScore: nextTotal
    });

    setLocked(true);

    router.push(
      `/results?lastRound=${encodeURIComponent(JSON.stringify(nextResult))}&progress=${roundIndex + 1}&total=${modeRounds.length}`
    );
  };

  return (
    <main className="page-shell min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur md:flex-row md:items-end md:justify-between md:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Сессия в процессе</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{modeLabels[mode]}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">
              В каждом раунде нужно поймать один конкретный тип события. Смотри сцену, дождись нужной точки
              и нажимай только в неё.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card-surface rounded-2xl px-4 py-3">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Игрок</div>
              <div className="mt-2 text-lg font-semibold text-white">{nickname}</div>
            </div>
            <div className="card-surface rounded-2xl px-4 py-3">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Раунд</div>
              <div className="mt-2 text-lg font-semibold text-white">
                {roundIndex + 1} из {modeRounds.length}
              </div>
            </div>
            <div className="card-surface rounded-2xl px-4 py-3">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Очки</div>
              <div className="mt-2 text-lg font-semibold text-white">{totalScore}</div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <VideoStage
            key={currentRound.id}
            title={currentRound.title}
            subtitle={currentRound.subtitle}
            eventType={currentRound.eventType}
            src={currentRound.video}
            onCatchMoment={handleCatchMoment}
            locked={locked}
          />

          <aside className="card-surface rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Что ловим в этом раунде</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{currentRound.eventType}</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">{currentRound.eventPrompt}</p>

            <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Подсказка по сцене</div>
              <p className="mt-2 text-sm leading-6 text-white/72">{currentRound.eventHint}</p>
            </div>

            <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-sky-400/10 to-orange-500/12 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-white/35">Как засчитывается попытка</div>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Сначала запускаешь эпизод, даёшь сцене войти в ритм и только потом жмёшь кнопку. Случайный клик
                в начале раунда не считается хорошей попыткой.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={null}>
      <PlayPageInner />
    </Suspense>
  );
}
