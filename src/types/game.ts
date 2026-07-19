export type VoiceMode = 'classic' | 'party';

export interface GameSnapshot {
  gameId: string;
  sequence: number[];
  currentIndex: number;
  calledNumbers: number[];
  currentNumber: number | null;
  voiceMode: VoiceMode;
  timestamp: number;
  version: 1;
}

export interface GameState extends GameSnapshot {
  hasStarted: boolean;
}
