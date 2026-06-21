"use client";

import { useTranslations } from "next-intl";

const LOCALES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
];

function getCurrentLocale(): string {
  if (typeof document === "undefined") return "ko";
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match ? match[1] : "ko";
}

function setLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
  window.location.reload();
}

export function LocaleSwitcher() {
  const t = useTranslations("Settings");
  const current = typeof document !== "undefined" ? getCurrentLocale() : "ko";

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-ink">{t("languageLabel")}</p>
      <div className="grid grid-cols-2 gap-2">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              current === code
                ? "bg-accent text-night"
                : "bg-elevated text-ink-soft hover:bg-line"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
