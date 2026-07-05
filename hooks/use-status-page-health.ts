'use client';

import { useEffect, useState } from 'react';

export type HealthPayload = {
  ok: boolean;
  status: string;
  checks: { database: boolean; smtp: boolean; billing: boolean };
  responseMs: number;
  timestamp: string;
};

export function useStatusPageHealth() {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      const data = (await res.json()) as HealthPayload;
      setHealth(data);
    } catch {
      setError(true);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return { health, loading, error, reload: load, operational: health?.ok ?? false };
}
