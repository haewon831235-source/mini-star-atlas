"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "msa.openai_key";

interface SettingsValue {
  apiKey: string | null;
  hasKey: boolean;
  setApiKey: (k: string) => void;
  clearApiKey: () => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

/** OpenAI API 키를 브라우저(localStorage)에만 저장하는 BYOK 설정 스토어. */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const k = localStorage.getItem(KEY);
      if (k) setKey(k);
    } catch {
      /* ignore */
    }
  }, []);

  const setApiKey = useCallback((k: string) => {
    const v = k.trim();
    setKey(v || null);
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  }, []);

  const clearApiKey = useCallback(() => {
    setKey(null);
    localStorage.removeItem(KEY);
  }, []);

  const value = useMemo<SettingsValue>(
    () => ({ apiKey, hasKey: Boolean(apiKey), setApiKey, clearApiKey }),
    [apiKey, setApiKey, clearApiKey],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
