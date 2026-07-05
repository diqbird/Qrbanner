'use client';

import { useCallback, useEffect, useState } from 'react';

type UseSettingsResourceOptions<T> = {
  url: string;
  parse: (json: unknown) => T;
  enabled?: boolean;
};

type SaveOptions = {
  method?: 'PATCH' | 'PUT' | 'POST';
  body: unknown;
};

export function useSettingsResource<T>({
  url,
  parse,
  enabled = true,
}: UseSettingsResourceOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const res = await fetch(url);
      if (res.ok) {
        setData(parse(await res.json()));
      }
    } catch {
      /* ignore — caller may show empty state */
    } finally {
      setLoading(false);
    }
  }, [enabled, parse, url]);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(
    async ({ method = 'PATCH', body }: SaveOptions) => {
      setSaving(true);
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, json };
      } finally {
        setSaving(false);
      }
    },
    [url]
  );

  return { data, loading, saving, reload, save, setData };
}
