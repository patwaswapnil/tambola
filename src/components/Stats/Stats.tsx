import styles from './Stats.module.css';

export function Stats({ calledCount }: { calledCount: number }) {
  const remaining = 90 - calledCount;
  return <section className={styles.stats} aria-label="Game statistics"><div><span>Called</span><strong>{calledCount}</strong></div><div><span>Remaining</span><strong>{remaining}</strong></div><div><span>Progress</span><strong>{Math.round((calledCount / 90) * 100)}%</strong></div></section>;
}
