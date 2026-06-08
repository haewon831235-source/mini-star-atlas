"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { CharacterAvatar } from "@/components/character-avatar";
import { RarityTag } from "@/components/rarity-tag";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/user-provider";
import { getCharacterById } from "@/data/characters";

export default function CharacterRevealPage() {
  const router = useRouter();
  const { profile, loading } = useUser();

  useEffect(() => {
    if (!loading && !profile) router.replace("/onboarding");
  }, [loading, profile, router]);

  if (!profile) return null;
  const character = getCharacterById(profile.character_id);
  if (!character) return null;

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center gradient-galaxy px-6 text-center">
      <Starfield count={70} />
      <div className="relative z-10 flex flex-col items-center" style={{ animation: "rise 0.7s ease both" }}>
        <p className="mb-6 text-sm tracking-widest text-ink-muted">당신의 수호 캐릭터</p>
        <div style={{ animation: "float 6s ease-in-out infinite" }}>
          <CharacterAvatar character={character} size={180} />
        </div>
        <div className="mt-8 flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-ink text-glow">{character.name}</h1>
          <RarityTag rarity={character.rarity} />
        </div>
        <p className="mt-1 text-sm font-medium text-accent">{character.title}</p>
        <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ink-soft">{character.description}</p>
      </div>
      <div className="relative z-10 mt-12 w-full">
        <Button size="lg" className="w-full" onClick={() => router.replace("/home")}>
          모험 시작하기 ✨
        </Button>
      </div>
    </main>
  );
}
