import { useEffect } from 'react';

interface KeyboardControlsOptions {
  onNext: () => void;
  isDisabled: boolean;
}

export function useKeyboardControls({ onNext, isDisabled }: KeyboardControlsOptions): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if ((event.key === 'Enter' || event.key === ' ') && !isDisabled) {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisabled, onNext]);
}
