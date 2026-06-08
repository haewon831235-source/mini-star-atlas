"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CharacterAvatar } from "@/components/character-avatar";
import { RarityTag } from "@/components/rarity-tag";
import { useUser } from "@/store/user-provider";
import { CHARACTERS } from "@/data/characters";

export default function CharacterCollectionPage() {
  const { profile } = useUser();
  if (!profile) return null;
  const ownedCount = profile.ownedCharacterIds.length;
  const pct = Math.round((ownedCount / CHARACTERS.length) * 100);

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={30} />
      <TopBar title="캐릭터 도감" back />
      <div className="relative z-10 px-4 py-4">
        <Card className="mb-4 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-bold text-ink">수집 현황</span>
            <span className="text-accent">{ownedCount} / {CHARACTERS.length}</span>
          </div>
          <Progress value={pct} />
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {CHARACTERS.map((c) => {
            const owned = profile.ownedCharacterIds.includes(c.id);
            return (
              <Link key={c.id} href={`/characters/${c.id}`}>
                <Card className="flex flex-col items-center gap-2 p-4 transition-transform active:scale-[0.98]">
                  <div className={owned ? "" : "opacity-30 grayscale"}>
                    <CharacterAvatar character={c} size={72} />
                  </div>
                  {owned ? (
                    <>
                      <p className="font-bold text-ink">{c.name}</p>
                      <RarityTag rarity={c.rarity} />
                    </>
                  ) : (
                    <p className="flex items-center gap-1 text-sm text-ink-muted">
                      <Lock size={14} /> 미보유
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
