"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { ZODIACS } from "@/data/zodiacs";
import { cn } from "@/lib/utils";

const SLIDES = [
  { emoji: "🌌", title: "12별자리의 세계로", desc: "당신의 생일이 곧 모험의 시작. 별자리와 수호 캐릭터가 당신을 기다려요." },
  { emoji: "🏰", title: "12 왕국을 탐험하세요", desc: "각 별자리마다 고유한 왕국과 NPC, 퀘스트가 펼쳐집니다." },
  { emoji: "🎂", title: "생일로 별자리를 찾아요", desc: "생년월일만 입력하면 당신만의 수호 캐릭터를 부여해 드려요." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const last = step === SLIDES.length - 1;

  const next = () => (last ? router.push("/signup") : setStep((s) => s + 1));
  const slide = SLIDES[step];

  return (
    <main className="relative flex min-h-[100dvh] flex-col gradient-galaxy px-6 py-10">
      <Starfield count={40} />
      <div className="relative z-10 flex justify-end">
        <Link href="/signup" className="text-sm text-ink-muted">건너뛰기</Link>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        {step === 1 ? (
          <div className="mb-8 flex flex-wrap justify-center gap-3" style={{ maxWidth: 280 }}>
            {ZODIACS.slice(0, 8).map((z) => (
              <span key={z.id} style={{ animation: "float 6s ease-in-out infinite" }}>
                <ZodiacIcon zodiac={z} size={48} />
              </span>
            ))}
          </div>
        ) : (
          <div className="mb-8 text-7xl" style={{ animation: "float 6s ease-in-out infinite" }}>
            {slide.emoji}
          </div>
        )}
        <h2 className="text-2xl font-extrabold text-ink">{slide.title}</h2>
        <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-soft">{slide.desc}</p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === step ? "w-6 bg-accent" : "w-2 bg-line",
              )}
            />
          ))}
        </div>
        <Button size="lg" className="w-full" onClick={next}>
          {last ? "내 별자리 찾기" : "다음"}
        </Button>
        <Link href="/login" className="text-sm text-ink-soft">
          이미 계정이 있어요 <span className="font-semibold text-accent">로그인</span>
        </Link>
      </div>
    </main>
  );
}
