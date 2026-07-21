import { useEffect, useRef, useState } from 'react';

export function useRestTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  function start(seconds: number) {
    setSecondsLeft(seconds);
    navigator.vibrate?.(50);
  }

  function skip() {
    setSecondsLeft(null);
  }

  useEffect(() => {
    if (secondsLeft === null) return;
    timeoutRef.current = window.setTimeout(() => {
      setSecondsLeft((s) => {
        if (s === null || s <= 1) {
          navigator.vibrate?.(200);
          return null;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [secondsLeft]);

  return { secondsLeft, start, skip };
}
