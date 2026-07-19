import { AlertTriangle, RotateCcw } from 'lucide-react';
import styles from './ConfirmNewGameDialog.module.css';

interface ConfirmNewGameDialogProps {
  calledCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmNewGameDialog({
  calledCount,
  onCancel,
  onConfirm
}: ConfirmNewGameDialogProps) {
  return (
    <div className={styles.backdrop} role="presentation">
      <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="new-game-title">
        <div className={styles.icon}><AlertTriangle aria-hidden="true" /></div>
        <h2 id="new-game-title">Start a new game?</h2>
        <p>
          Your current game has <strong>{calledCount} called numbers</strong>. Starting over will discard its
          saved sequence and progress.
        </p>
        <div className={styles.actions}>
          <button className={styles.cancel} type="button" onClick={onCancel} autoFocus>
            Keep current game
          </button>
          <button className={styles.confirm} type="button" onClick={onConfirm}>
            <RotateCcw size={18} aria-hidden="true" />Start new game
          </button>
        </div>
      </section>
    </div>
  );
}
