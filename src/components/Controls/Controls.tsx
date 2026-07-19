import { Expand, RotateCcw, Sparkles } from 'lucide-react';
import styles from './Controls.module.css';

interface ControlsProps {
  onNext: () => void;
  onRestart: () => void;
  onFullscreen: () => void;
  isComplete: boolean;
  isSpinning: boolean;
}

export function Controls({ onNext, onRestart, onFullscreen, isComplete, isSpinning }: ControlsProps) {
  return (
    <section className={styles.controls} aria-label="Game controls">
      <button className={styles.secondaryButton} type="button" onClick={onRestart} disabled={isSpinning}><RotateCcw size={20} aria-hidden="true" />New game</button>
      <button className={styles.nextButton} type="button" onClick={onNext} disabled={isComplete || isSpinning}><Sparkles size={24} aria-hidden="true" />{isSpinning ? 'Machine spinning…' : isComplete ? 'All numbers called' : 'Call next number'}</button>
      <button className={styles.iconButton} type="button" onClick={onFullscreen} aria-label="Toggle fullscreen"><Expand size={23} aria-hidden="true" /></button>
    </section>
  );
}
