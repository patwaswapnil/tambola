import { useCallback } from 'react';
import { Howl } from 'howler';

const voiceClips = new Map<number, Howl>();
const voiceRoot = `${import.meta.env.BASE_URL}audio/voice/indian-female`;

function getVoiceClip(number: number): Howl {
  const existingClip = voiceClips.get(number);
  if (existingClip !== undefined) return existingClip;

  const clip = new Howl({
    src: [`${voiceRoot}/${number}.mp3`],
    preload: true,
    volume: 1
  });
  voiceClips.set(number, clip);
  return clip;
}

/** Plays the bundled Indian English female voice pack and warms the next calls in memory. */
export function useAnnouncement(): {
  announce: (number: number) => void;
  preloadAnnouncements: (numbers: readonly number[]) => void;
} {
  const announce = useCallback((number: number) => {
    const clip = getVoiceClip(number);
    clip.stop();
    clip.play();
  }, []);

  const preloadAnnouncements = useCallback((numbers: readonly number[]) => {
    numbers.forEach((number) => getVoiceClip(number));
  }, []);

  return { announce, preloadAnnouncements };
}
