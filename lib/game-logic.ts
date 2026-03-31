import type { GameMode } from './game-data';

export type RoundResult = {
  roundId: number;
  mode: GameMode;
  roundTitle: string;
  eventType: string;
  clickedAt: number;
  eventTimestamp: number;
  difference: number;
  score: number;
  validAttempt?: boolean;
};

export function calculateScore(mode: GameMode, differenceSeconds: number) {
  const diff = Math.abs(differenceSeconds);

  if (mode === 'football') {
    if (diff <= 0.5) return 120;
    if (diff <= 1) return 100;
    if (diff <= 2) return 70;
    if (diff <= 3) return 40;
    return 0;
  }

  if (diff <= 0.2) return 150;
  if (diff <= 0.5) return 100;
  if (diff <= 1) return 60;
  if (diff <= 1.5) return 20;
  return 0;
}

export function getResultTone(round: RoundResult) {
  if (round.validAttempt === false) {
    return {
      title: 'Попытка не засчитана',
      text: 'Эпизод не был нормально просмотрен, поэтому такой клик нельзя считать честной попыткой.'
    };
  }

  const difference = round.difference;
  const diff = Math.abs(difference);

  if (diff <= 0.25) {
    return {
      title: 'Идеально',
      text: 'Ты почти идеально вошёл в пик эпизода.'
    };
  }

  if (diff <= 0.75) {
    return {
      title: 'Очень близко',
      text:
        difference < 0
          ? 'Ты почувствовал развязку чуть раньше, чем она произошла.'
          : 'Ты почти поймал момент, но среагировал на долю секунды позже.'
    };
  }

  if (difference < 0) {
    return {
      title: 'Чуть раньше',
      text: 'Ты читаешь эпизод смело, но входишь в кульминацию раньше развязки.'
    };
  }

  if (difference > 0 && diff <= 2) {
    return {
      title: 'Чуть позже',
      text: 'Ты ждёшь подтверждения и потому отпускаешь идеальный момент.'
    };
  }

  return {
    title: 'Мимо',
    text: 'В этот раз напряжение эпизода увело тебя в сторону от настоящего пика.'
  };
}

export function formatSeconds(value: number) {
  const total = Math.max(0, value);
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(total % 60)
    .toString()
    .padStart(2, '0');
  const tenths = Math.floor((total % 1) * 10)
    .toString()
    .padStart(1, '0');

  return `${minutes}:${seconds}.${tenths}`;
}

export function getReactionStyle(results: RoundResult[]) {
  const earlier = results.filter((item) => item.difference < 0).length;
  const later = results.filter((item) => item.difference > 0).length;

  const footballScore = results
    .filter((item) => item.mode === 'football')
    .reduce((sum, item) => sum + item.score, 0);
  const esportsScore = results
    .filter((item) => item.mode === 'esports')
    .reduce((sum, item) => sum + item.score, 0);

  if (earlier >= later + 1) {
    return 'Опережающий — ты чаще входишь в эпизод до фактической развязки.';
  }

  if (later >= earlier + 1) {
    return 'Выжидающий — ты предпочитаешь подтверждение и потому иногда опаздываешь.';
  }

  if (esportsScore > footballScore) {
    return 'Лучше чувствуешь резкие эпизоды — твоя точность выше там, где всё решает вспышка.';
  }

  if (footballScore > esportsScore) {
    return 'Лучше читаешь развитие эпизода — ты сильнее там, где напряжение нарастает постепенно.';
  }

  return 'Сбалансированный — ты держишь ритм и без явного перекоса входишь в момент.';
}
