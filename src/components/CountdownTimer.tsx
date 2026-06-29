"use client";

import { useEffect, useState } from "react";

type Props = {
  createdAt: string;
  expiryHours?: number;
};

export default function CountdownTimer({ createdAt, expiryHours = 24 }: Props) {
  const [remaining, setRemaining] = useState<number>(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const expiry = new Date(createdAt).getTime() + expiryHours * 60 * 60 * 1000;

    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setRemaining(0);
        return;
      }
      setRemaining(diff);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt, expiryHours]);

  if (expired) {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
        <span className="inline-block size-1.5 rounded-full bg-red-500" />
        Pembayaran kadaluarsa
      </span>
    );
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-yellow-400">
      <span className="inline-block size-1.5 animate-pulse rounded-full bg-yellow-400" />
      {hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`}
    </span>
  );
}
