import type { GameMode } from './game-data';
import type { RoundResult } from './game-logic';

const STORAGE_KEY = 'pik-momenta-session';

export type SessionData = {
  nickname: string;
  mode: GameMode;
  results: RoundResult[];
  totalScore: number;
};

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveSession(data: SessionData) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadSession(): SessionData | null {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
}
