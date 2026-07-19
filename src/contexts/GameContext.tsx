import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { clearGame, loadGame, saveGame } from '../services/gameStorage';
import type { GameSnapshot, GameState } from '../types/game';
import { createGameId, fisherYatesShuffle, tambolaNumbers } from '../utils/game';

interface GameContextValue {
  game: GameState;
  savedGame: GameSnapshot | null;
  startNewGame: () => void;
  resumeGame: () => void;
  revealNextNumber: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function createFreshGame(): GameState {
  return {
    gameId: createGameId(),
    sequence: fisherYatesShuffle(tambolaNumbers),
    currentIndex: 0,
    calledNumbers: [],
    currentNumber: null,
    voiceMode: 'classic',
    timestamp: Date.now(),
    version: 1,
    hasStarted: false
  };
}

function snapshotGame(game: GameState): GameSnapshot {
  return {
    gameId: game.gameId,
    sequence: game.sequence,
    currentIndex: game.currentIndex,
    calledNumbers: game.calledNumbers,
    currentNumber: game.currentNumber,
    voiceMode: game.voiceMode,
    timestamp: game.timestamp,
    version: game.version
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [savedGame, setSavedGame] = useState<GameSnapshot | null>(() => loadGame());
  const [game, setGame] = useState<GameState>(createFreshGame);

  const startNewGame = useCallback(() => {
    clearGame();
    setSavedGame(null);
    setGame(createFreshGame());
  }, []);

  const resumeGame = useCallback(() => {
    if (savedGame === null) return;
    setGame({ ...savedGame, hasStarted: savedGame.calledNumbers.length > 0 });
    setSavedGame(null);
  }, [savedGame]);

  const revealNextNumber = useCallback(() => {
    setGame((previousGame) => {
      if (previousGame.currentIndex >= previousGame.sequence.length) return previousGame;

      const nextNumber = previousGame.sequence[previousGame.currentIndex];
      const nextGame: GameState = {
        ...previousGame,
        currentIndex: previousGame.currentIndex + 1,
        calledNumbers: [...previousGame.calledNumbers, nextNumber],
        currentNumber: nextNumber,
        timestamp: Date.now(),
        hasStarted: true
      };
      saveGame(snapshotGame(nextGame));
      return nextGame;
    });
  }, []);

  const value = useMemo(
    () => ({ game, savedGame, startNewGame, resumeGame, revealNextNumber }),
    [game, savedGame, startNewGame, resumeGame, revealNextNumber]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (context === null) throw new Error('useGame must be used within a GameProvider');
  return context;
}
