import type { GameSnapshot } from '../types/game';

const STORAGE_KEY = 'tambola-royale:game';

function isValidSnapshot(value: unknown): value is GameSnapshot {
  if (typeof value !== 'object' || value === null) return false;

  const game = value as Record<string, unknown>;
  return (
    game.version === 1 &&
    typeof game.gameId === 'string' &&
    Array.isArray(game.sequence) &&
    game.sequence.length === 90 &&
    game.sequence.every((number) => typeof number === 'number') &&
    typeof game.currentIndex === 'number' &&
    Array.isArray(game.calledNumbers) &&
    (typeof game.currentNumber === 'number' || game.currentNumber === null) &&
    (game.voiceMode === 'classic' || game.voiceMode === 'party') &&
    typeof game.timestamp === 'number'
  );
}

export function loadGame(): GameSnapshot | null {
  try {
    const rawGame = localStorage.getItem(STORAGE_KEY);
    if (rawGame === null) return null;

    const game: unknown = JSON.parse(rawGame);
    return isValidSnapshot(game) ? game : null;
  } catch {
    return null;
  }
}

export function saveGame(game: GameSnapshot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
}

export function clearGame(): void {
  localStorage.removeItem(STORAGE_KEY);
}
