export type GameMode = 'football' | 'esports';

export type RoundData = {
  id: number;
  mode: GameMode;
  title: string;
  subtitle: string;
  eventType: string;
  eventPrompt: string;
  eventHint: string;
  eventTimestamp: number;
  video: string;
};

export const modeLabels: Record<GameMode, string> = {
  football: 'Футбол',
  esports: 'Киберспорт'
};

export const rounds: RoundData[] = [
  {
    id: 1,
    mode: 'football',
    title: 'Контратака через центр',
    subtitle: 'Нажми ровно в ту секунду, когда игрок бьёт по воротам.',
    eventType: 'Удар по воротам',
    eventPrompt: 'Поймай именно удар, а не начало атаки и не сам гол.',
    eventHint: 'Смотри на замах и момент касания мяча при ударе.',
    eventTimestamp: 7.2,
    video: '/videos/football-1.mp4'
  },
  {
    id: 2,
    mode: 'football',
    title: 'Рывок в штрафную',
    subtitle: 'Нажми ровно в ту секунду, когда игрок бьёт по воротам.',
    eventType: 'Удар по воротам',
    eventPrompt: 'Здесь тоже нужно поймать именно удар, а не полёт мяча и не сам гол.',
    eventHint: 'Смотри на замах и момент касания мяча при ударе.',
    eventTimestamp: 7.8,
    video: '/videos/football-2.mp4'
  },
  {
    id: 3,
    mode: 'football',
    title: 'Быстрый розыгрыш перед ударом',
    subtitle: 'Нажми в секунду завершающего удара по воротам.',
    eventType: 'Решающий удар',
    eventPrompt: 'Цель — не розыгрыш и не пас, а финальный удар.',
    eventHint: 'Жди последнего касания, после которого мяч уходит в створ.',
    eventTimestamp: 4.6,
    video: '/videos/football-3.mp4'
  },
  {
    id: 4,
    mode: 'esports',
    title: 'Дуэль один в один',
    subtitle: 'Нажми в момент фрага.',
    eventType: 'Фраг',
    eventPrompt: 'Лови именно фраг, а не просто первый контакт или наводку.',
    eventHint: 'Нужна доля секунды, где уже ясно, что соперник проигран.',
    eventTimestamp: 6.1,
    video: '/videos/esports-1.mp4'
  },
  {
    id: 5,
    mode: 'esports',
    title: 'Выход на клатч-размен',
    subtitle: 'Нажми в момент фрага.',
    eventType: 'Фраг',
    eventPrompt: 'Здесь нужен именно фраг, а не первый контакт или наводка.',
    eventHint: 'Смотри на долю секунды, где противник уже проигран.',
    eventTimestamp: 9.0,
    video: '/videos/esports-2.mp4'
  },
  {
    id: 6,
    mode: 'esports',
    title: 'Резкий пик перестрелки',
    subtitle: 'Нажми в момент фрага.',
    eventType: 'Фраг',
    eventPrompt: 'Здесь тоже нужен именно фраг, а не первый выстрел в сцене.',
    eventHint: 'Жми, когда уже очевидно, что соперник убит, но не жди долгого падения тела.',
    eventTimestamp: 10.6,
    video: '/videos/esports-3.mp4'
  }
];

export function getRoundsByMode(mode: GameMode) {
  return rounds.filter((round) => round.mode === mode);
}
