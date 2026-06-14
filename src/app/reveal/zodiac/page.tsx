"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/user-provider";
import { getZodiacById } from "@/data/zodiacs";
import { getZodiacByBirthday } from "@/lib/zodiac";
import type { Zodiac } from "@/types/index";

export default function ZodiacRevealPage() {
  const router = useRouter();
  const { profile, loading } = useUser();
  const [zodiac, setZodiac] = useState<Zodiac | null>(null);

  useEffect(() => {
    if (loading) return;

    if (profile) {
      const z = getZodiacById(profile.zodiac_id);
      if (z) { setZodiac(z); return; }
    }

    const birthday = sessionStorage.getItem("pending_birthday");
    if (!birthday) { router.replace("/onboarding"); return; }
    const z = getZodiacByBirthday(birthday);
    if (z) setZodiac(z);
  }, [loading, profile, router]);

  if (!zodiac) return null;

  const next = () => {
    if (profile) {
      router.push("/reveal/character");
    } else {
      router.push("/signup");
    }
  };

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center gradient-galaxy px-6 text-center">
      <Starfield count={70} />
      <div className="relative z-10 flex flex-col items-center" style={{ animation: "rise 0.7s ease both" }}>
        <p className="mb-6 text-sm tracking-widest text-ink-muted">당신의 수호 별자리는</p>
        <div style={{ animation: "float 6s ease-in-out infinite" }}>
          <ZodiacIcon zodiac={zodiac} size={140} className="glow-gold" />
        </div>
        <h1 className="mt-8 text-3xl font-extrabold text-ink text-glow">
          {zodiac.name_ko} {zodiac.symbol}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{zodiac.name_en} · {zodiac.ruling_planet}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {zodiac.traits.map((t) => (
            <Badge key={t} className="bg-elevated text-ink-soft">#{t}</Badge>
          ))}
        </div>
        <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-ink-soft">{zodiac.description}</p>
      </div>
      <div className="relative z-10 mt-12 w-full">
        <Button size="lg" className="w-full" onClick={next}>
          {profile ? "수호 캐릭터 만나기" : "가입하고 캐릭터 받기"}
        </Button>
      </div>
    </main>
  );
}
