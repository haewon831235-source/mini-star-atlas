"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { useUser } from "@/store/user-provider";
import { useSettings } from "@/store/settings-provider";
import { getCompatibility, getZodiacByBirthday } from "@/lib/zodiac";
import { aiCompatibility } from "@/lib/openai";
import type { RelationType, CompatibilityResult } from "@/types";
import { cn } from "@/lib/utils";

const RELATIONS: { key: RelationType; label: string; emoji: string }[] = [
  { key: "friend", label: "우정", emoji: "🤝" },
  { key: "love", label: "연애", emoji: "💖" },
  { key: "business", label: "비즈니스", emoji: "💼" },
];

export default function CompatibilityPage() {
  const { profile } = useUser();
  const [me, setMe] = useState(profile?.birthday ?? "");
  const [partner, setPartner] = useState("");
  const [relation, setRelation] = useState<RelationType>("love");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const { hasKey, apiKey } = useSettings();
  const [ai, setAi] = useState<{ loading: boolean; text: string; error: string }>({
    loading: false,
    text: "",
    error: "",
  });

  const run = () => {
    if (!me || !partner) return;
    setAi({ loading: false, text: "", error: "" });
    setResult(getCompatibility(me, partner, relation));
  };

  const za = me ? getZodiacByBirthday(me) : null;
  const zb = partner ? getZodiacByBirthday(partner) : null;

  const runAi = async () => {
    if (!apiKey || !result || !za || !zb) return;
    setAi({ loading: true, text: "", error: "" });
    try {
      const text = await aiCompatibility(apiKey, za.name_ko, zb.name_ko, result);
      setAi({ loading: false, text, error: "" });
    } catch (e) {
      setAi({ loading: false, text: "", error: e instanceof Error ? e.message : "오류가 발생했어요." });
    }
  };

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={25} />
      <TopBar title="별자리 궁합" />
      <div className="relative z-10 space-y-5 px-4 py-4">
        <Card className="space-y-4 p-4">
          <Input label="나의 생일" type="date" value={me} onChange={(e) => setMe(e.target.value)} />
          <Input label="상대의 생일" type="date" value={partner} onChange={(e) => setPartner(e.target.value)} />
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink-soft">관계 유형</p>
            <div className="flex gap-2">
              {RELATIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRelation(r.key)}
                  className={cn(
                    "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors",
                    relation === r.key ? "bg-secondary text-ink" : "bg-elevated text-ink-soft",
                  )}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>
          <Button size="lg" className="w-full" disabled={!me || !partner} onClick={run}>
            궁합 보기
          </Button>
        </Card>

        {result && za && zb && (
          <Card className="space-y-4 p-6 text-center" style={{ animation: "rise 0.4s ease both" }}>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <ZodiacIcon zodiac={za} size={56} />
                <span className="text-xs text-ink-soft">{za.name_ko}</span>
              </div>
              <span className="text-2xl">💞</span>
              <div className="flex flex-col items-center gap-1">
                <ZodiacIcon zodiac={zb} size={56} />
                <span className="text-xs text-ink-soft">{zb.name_ko}</span>
              </div>
            </div>
            <div>
              <p className="text-5xl font-extrabold text-accent text-glow">{result.score}</p>
              <p className="mt-1 font-bold text-ink">{result.title}</p>
            </div>
            <p className="text-[15px] leading-relaxed text-ink-soft">{result.comment}</p>
            <div className="rounded-xl bg-elevated/70 p-3 text-sm text-ink">
              💡 {result.advice}
            </div>

            {/* AI 코멘트 */}
            {hasKey ? (
              <div className="space-y-2 border-t border-line pt-3 text-left">
                {ai.text && <p className="text-[15px] leading-relaxed text-ink-soft">✨ {ai.text}</p>}
                {ai.error && <p className="text-sm text-error">{ai.error}</p>}
                <Button variant="secondary" className="w-full" disabled={ai.loading} onClick={runAi}>
                  {ai.loading ? "별에게 묻는 중..." : ai.text ? "다시 코멘트 받기" : "✨ AI 궁합 코멘트 받기"}
                </Button>
              </div>
            ) : (
              <Link href="/mypage/settings" className="block border-t border-line pt-3">
                <Button variant="outline" className="w-full">
                  설정에서 OpenAI 키 등록하고 AI 코멘트 켜기
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}
