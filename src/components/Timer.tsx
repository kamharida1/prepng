"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  startedAt: number;
  timeLimitMinutes: number;
  onExpire: () => void;
}

export function Timer({ startedAt, timeLimitMinutes, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(timeLimitMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, timeLimitMinutes * 60 - elapsed);
      setRemaining(left);

      if (left === 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, timeLimitMinutes, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const urgent = remaining <= 300;

  return (
    <div
      className={`rounded-lg px-3 py-1.5 font-mono text-sm font-semibold ${
        urgent ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"
      }`}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
