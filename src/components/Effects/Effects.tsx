import { useEffect } from "react";

export const playSound = (path, loop: boolean = false, volume: number = 1) => {
  const audio = new Audio(path);
  audio.loop = loop;
  audio.volume = volume;
  audio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
  return audio;
};

export const pauseSound = (audio: HTMLAudioElement | null) => {
  if (audio && typeof audio.pause === "function") {
    audio.pause();
    audio.currentTime = 0;
  }
};

export const reroll = (maxx: number = 1, mmin: number = 0) => {
  return Math.floor(Math.random() * maxx) + mmin;
};

export function useFormattedTime(
  time: Date,
  setTime: (date: Date) => void,
): string {
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [setTime]);

  return time.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
