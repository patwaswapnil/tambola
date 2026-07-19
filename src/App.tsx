import { useCallback, useEffect, useState } from 'react';
import { Board } from './components/Board/Board';
import { ConfirmNewGameDialog } from './components/ConfirmNewGameDialog/ConfirmNewGameDialog';
import { Controls } from './components/Controls/Controls';
import { CurrentNumber } from './components/CurrentNumber/CurrentNumber';
import { History } from './components/History/History';
import { ResumeDialog } from './components/ResumeDialog/ResumeDialog';
import { Stats } from './components/Stats/Stats';
import { useGame } from './contexts/GameContext';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useMachineSound } from './hooks/useMachineSound';
import { useAnnouncement } from './hooks/useAnnouncement';
import { MACHINE_SPIN_DURATION_MS } from './features/machine/machineConfig';
import styles from './App.module.css';

export default function App() {
  const { game, savedGame, revealNextNumber, resumeGame, startNewGame } = useGame();
  const { toggleFullscreen } = useFullscreen();
  const { playMachineSpin } = useMachineSound();
  const { announce, preloadAnnouncements } = useAnnouncement();
  const isComplete = game.currentIndex >= game.sequence.length;
  const [isSpinning, setIsSpinning] = useState(false);
  const [settledCallCount, setSettledCallCount] = useState(game.calledNumbers.length);
  const [isNewGameConfirmationOpen, setIsNewGameConfirmationOpen] = useState(false);
  const previousNumber = game.calledNumbers.at(-2) ?? null;
  const visibleCalledNumbers = game.calledNumbers.slice(0, settledCallCount);

  useEffect(() => {
    if (!isSpinning) {
      setSettledCallCount(game.calledNumbers.length);
      return;
    }

    const settleTimer = window.setTimeout(() => {
      setSettledCallCount(game.calledNumbers.length);
      setIsSpinning(false);
      if (game.currentNumber !== null) announce(game.currentNumber);
    }, MACHINE_SPIN_DURATION_MS);
    return () => window.clearTimeout(settleTimer);
  }, [announce, game.calledNumbers.length, game.currentNumber, isSpinning]);

  useEffect(() => {
    preloadAnnouncements(game.sequence.slice(game.currentIndex, game.currentIndex + 5));
  }, [game.currentIndex, game.sequence, preloadAnnouncements]);

  const handleReveal = useCallback(() => {
    if (isComplete || isSpinning || savedGame !== null) return;
    setIsSpinning(true);
    playMachineSpin();
    revealNextNumber();
  }, [isComplete, isSpinning, playMachineSpin, revealNextNumber, savedGame]);

  const requestNewGame = useCallback(() => {
    const activeGameCalls = savedGame?.calledNumbers.length ?? game.calledNumbers.length;
    if (activeGameCalls > 0) {
      setIsNewGameConfirmationOpen(true);
      return;
    }
    startNewGame();
  }, [game.calledNumbers.length, savedGame, startNewGame]);

  const confirmNewGame = useCallback(() => {
    setIsNewGameConfirmationOpen(false);
    startNewGame();
  }, [startNewGame]);

  useKeyboardControls({ onNext: handleReveal, isDisabled: isComplete || isSpinning || savedGame !== null });

  const activeGameCalls = savedGame?.calledNumbers.length ?? game.calledNumbers.length;

  return <main className={styles.appShell}><div className={styles.mainGrid}><aside className={styles.caller}><CurrentNumber number={game.currentNumber} previousNumber={previousNumber} isSpinning={isSpinning} /><History numbers={visibleCalledNumbers} /></aside><Board calledNumbers={visibleCalledNumbers} currentNumber={isSpinning ? null : game.currentNumber} /></div><footer className={styles.footer}><Stats calledCount={visibleCalledNumbers.length} /><Controls onNext={handleReveal} onRestart={requestNewGame} onFullscreen={() => { void toggleFullscreen(); }} isComplete={isComplete} isSpinning={isSpinning} /><p className={styles.shortcut}>Press <kbd>Enter</kbd> or <kbd>Space</kbd> to call</p></footer>{savedGame !== null && <ResumeDialog game={savedGame} onResume={resumeGame} onStartNew={requestNewGame} />}{isNewGameConfirmationOpen && <ConfirmNewGameDialog calledCount={activeGameCalls} onCancel={() => setIsNewGameConfirmationOpen(false)} onConfirm={confirmNewGame} />}</main>;
}
