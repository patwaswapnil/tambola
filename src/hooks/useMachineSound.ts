import { useCallback } from 'react';
import { Howler } from 'howler';
import { MACHINE_SPIN_DURATION_SECONDS } from '../features/machine/machineConfig';

function createMechanicalTick(
  context: AudioContext,
  destination: AudioNode,
  startTime: number,
  intensity: number
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(1_450, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(430, startTime + 0.035);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.045 * intensity, startTime + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);
  oscillator.connect(gain).connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.045);
}

function createSlotMotor(
  context: AudioContext,
  destination: AudioNode,
  startTime: number
): void {
  const motor = context.createOscillator();
  const gain = context.createGain();
  const flutter = context.createOscillator();
  const flutterGain = context.createGain();

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.075, startTime + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.055, startTime + 2.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + MACHINE_SPIN_DURATION_SECONDS);

  motor.type = 'triangle';
  motor.frequency.setValueAtTime(105, startTime);
  motor.frequency.exponentialRampToValueAtTime(175, startTime + 1.2);
  motor.frequency.exponentialRampToValueAtTime(92, startTime + MACHINE_SPIN_DURATION_SECONDS);

  flutter.type = 'sine';
  flutter.frequency.setValueAtTime(8, startTime);
  flutterGain.gain.setValueAtTime(0.02, startTime);

  flutter.connect(flutterGain).connect(gain.gain);
  motor.connect(gain).connect(destination);
  motor.start(startTime);
  flutter.start(startTime);
  motor.stop(startTime + MACHINE_SPIN_DURATION_SECONDS);
  flutter.stop(startTime + MACHINE_SPIN_DURATION_SECONDS);
}

function createSettleChime(context: AudioContext, destination: AudioNode, startTime: number): void {
  [880, 1_320].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const chimeStart = startTime + index * 0.035;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, chimeStart);
    gain.gain.setValueAtTime(0.0001, chimeStart);
    gain.gain.exponentialRampToValueAtTime(0.055, chimeStart + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, chimeStart + 0.28);
    oscillator.connect(gain).connect(destination);
    oscillator.start(chimeStart);
    oscillator.stop(chimeStart + 0.3);
  });
}

/** Plays a short, offline synthesized lottery-machine spin through Howler's audio graph. */
export function useMachineSound(): { playMachineSpin: () => void } {
  const playMachineSpin = useCallback(() => {
    // This initializes Howler's shared audio context and retains its global volume/mute controls.
    Howler.volume(Howler.volume());
    if (!Howler.usingWebAudio || Howler.ctx === null) return;

    const context = Howler.ctx;
    const scheduleSound = () => {
      const startTime = context.currentTime;
      createSlotMotor(context, Howler.masterGain, startTime);

      let tickTime = startTime + 0.12;
      const tickCount = 30;
      for (let index = 0; index < tickCount; index += 1) {
        const progress = index / (tickCount - 1);
        const distanceFromCenter = Math.abs(progress * 2 - 1);
        const interval = 0.052 + distanceFromCenter * 0.085;
        createMechanicalTick(context, Howler.masterGain, tickTime, 0.72 + (1 - distanceFromCenter) * 0.28);
        tickTime += interval;
      }
      createSettleChime(context, Howler.masterGain, startTime + MACHINE_SPIN_DURATION_SECONDS - 0.08);
    };

    if (context.state === 'suspended') {
      void context.resume().then(scheduleSound).catch(() => undefined);
    } else {
      scheduleSound();
    }
  }, []);

  return { playMachineSpin };
}
