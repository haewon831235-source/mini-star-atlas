"use client";

import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/user-provider";
import { KINGDOMS } from "@/data/kingdoms";
import { getZodiacById } from "@/data/zodiacs";

export default function WorldMapPage() {
  const { profile } = useUser();
  if (!profile) return null;

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={50} />
      <TopBar title="월드맵" />
      <div className="relative z-10 px-4 py-4">
        <p className="mb-4 px-1 text-sm text-ink-soft">12 별자리 왕국을 탐험하세요 🗺️</p>
        <div className="grid grid-cols-2 gap-3">
          {KINGDOMS.map((k) => {
            const zodiac = getZodiacById(k.zodiac_id)!;
            const mine = k.zodiac_id === profile.zodiac_id;
            return (
              <Link key={k.id} href={`/worldmap/${k.id}`}>
                <Card className={`relative h-full p-4 transition-transform active:scale-[0.98] ${mine ? "border-accent/60 glow-gold" : ""}`}>
                  {mine && (
                    <Badge className="absolute right-2 top-2 bg-accent text-night">MY</Badge>
                  )}
                  <ZodiacIcon zodiac={zodiac} size={44} className="mb-3" />
                  <p className="text-sm font-bold leading-snug text-ink">{k.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{k.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
