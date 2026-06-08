"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { useUser } from "@/store/user-provider";
import { useSettings } from "@/store/settings-provider";
import { getZodiacById } from "@/data/zodiacs";
import { getDailyFortune } from "@/lib/zodiac";
import { aiFortune } from "@/lib/openai";

function Gauge({ score }: { score: number }) {
  return (
    <div
      className="relative flex h-36 w-36 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(var(--color-accent) ${score * 3.6}deg, var(--color-elevated) 0deg)` }}
    >
      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-surface">
        <span className="text-4xl font-extrabold text-ink">{score}</span>
        <span className="text-xs text-ink-muted">/ 100</span>
      </div>
    </div>
  );
}

const CATS = [
  { key: "love", label: "애정운", emoji: "💖" },
  { key: "money", label: "금전운", emoji: "💰" },
  { key: "health", label: "건강운", emoji: "🌿" },
  { key: "luck", label: "행운", emoji: "🍀" },
] as const;

export default function FortunePage() {
  const { profile } = useUser();
  const { hasKey, apiKey } = useSettings();
  const [ai, setAi] = useState<{ loading: boolean; text: string; error: string }>({
    loading: false,
    text: "",
    error: "",
  });
  if (!profile) return null;
  const zodiac = getZodiacById(profile.zodiac_id)!;
  const today = new Date().toISOString().slice(0, 10);
  const f = getDailyFortune(profile.zodiac_id, today);

  const runAi = async () => {
    if (!apiKey) return;
    setAi({ loading: true, text: "", error: "" });
    try {
      const text = await aiFortune(apiKey, zodiac.name_ko, f);
      setAi({ loading: false, text, error: "" });
    } catch (e) {
      setAi({ loading: false, text: "", error: e instanceof Error ? e.message : "오류가 발생했어요." });
    }
  };

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={30} />
      <TopBar title="오늘의 운세" back />
      <div className="relative z-10 space-y-5 px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <ZodiacIcon zodiac={zodiac} size={32} />
            <span className="font-bold text-ink">{zodiac.name_ko}</span>
            <span className="text-sm text-ink-muted">{today}</span>
          </div>
          <Gauge score={f.total} />
          <p className="max-w-xs text-center text-[15px] leading-relaxed text-ink-soft">{f.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CATS.map((c) => {
            const v = f[c.key];
            return (
              <Card key={c.key} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">{c.emoji} {c.label}</span>
                  <span className="text-sm font-bold text-accent">{v}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-elevated">
                  <div className="h-full gradient-gold" style={{ width: `${v}%` }} />
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="flex items-center justify-around p-4">
          <div className="text-center">
            <p className="text-xs text-ink-muted">행운의 아이템</p>
            <p className="mt-1 font-bold text-ink">{f.luckyItem}</p>
          </div>
          <div className="h-8 w-px bg-line" />
          <div className="text-center">
            <p className="text-xs text-ink-muted">행운의 색</p>
            <p className="mt-1 font-bold text-ink">{f.luckyColor}</p>
          </div>
        </Card>

        {/* AI 운세 풀이 */}
        <Card className="space-y-3 p-4">
          <p className="text-sm font-bold text-ink">✨ AI 운세 풀이</p>
          {hasKey ? (
            <>
              {ai.text && <p className="text-[15px] leading-relaxed text-ink-soft">{ai.text}</p>}
              {ai.error && <p className="text-sm text-error">{ai.error}</p>}
              <Button variant="secondary" className="w-full" disabled={ai.loading} onClick={runAi}>
                {ai.loading ? "별에게 묻는 중..." : ai.text ? "다시 풀이하기" : "AI로 자세히 풀이 보기"}
              </Button>
            </>
          ) : (
            <Link href="/mypage/settings">
              <Button variant="outline" className="w-full">
                설정에서 OpenAI 키 등록하고 AI 풀이 켜기
              </Button>
            </Link>
          )}
        </Card>
      </div>
    </main>
  );
}
