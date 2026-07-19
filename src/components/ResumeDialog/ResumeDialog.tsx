import { History, Plus } from 'lucide-react';
import type { GameSnapshot } from '../../types/game';
import styles from './ResumeDialog.module.css';

interface ResumeDialogProps { game: GameSnapshot; onResume: () => void; onStartNew: () => void; }

export function ResumeDialog({ game, onResume, onStartNew }: ResumeDialogProps) {
  return <div className={styles.backdrop} role="presentation"><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="resume-title"><p className={styles.kicker}>Tambola Royale</p><h1 id="resume-title">Resume your last game?</h1><p>You have <strong>{game.calledNumbers.length} of 90</strong> numbers called. Your exact shuffled sequence is safely saved on this device.</p><div className={styles.actions}><button className={styles.resume} type="button" onClick={onResume} autoFocus><History size={21} aria-hidden="true" />Resume game</button><button className={styles.newGame} type="button" onClick={onStartNew}><Plus size={21} aria-hidden="true" />Start new game</button></div></section></div>;
}
