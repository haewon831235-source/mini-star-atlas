"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CharacterAvatar } from "@/components/character-avatar";
import { RarityTag } from "@/components/rarity-tag";
import { useUser } from "@/store/user-provider";
import { useToast } from "@/store/toast-provider";
import { getCharacterById } from "@/data/characters";
import { getZodiacById } from "@/data/zodiacs";
import { PRODUCTS } from "@/data/products";
import { formatKRW } from "@/lib/utils";

const STAT_LABEL: Record<string, string> = { power: "파워", magic: "마법", luck: "행운", charm: "매력" };

export default function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { profile, ownCharacter } = useUser();
  const toast = useToast();
  const character = getCharacterById(id);
  if (!character) return notFound();

  const zodiac = getZodiacById(character.zodiac_id)!;
  const owned = profile?.ownedCharacterIds.includes(character.id);
  const goods = PRODUCTS.filter((p) => p.character_id === character.id);

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={50} />
      <TopBar title={character.name} back />
      <div className="relative z-10 space-y-5 px-4 py-5">
        <Card className="flex flex-col items-center gap-3 p-6 text-center gradient-galaxy">
          <div className={owned ? "" : "opacity-50 grayscale"}>
            <CharacterAvatar character={character} size={140} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink">{character.name}</h2>
            <RarityTag rarity={character.rarity} />
          </div>
          <p className="text-sm font-medium text-accent">{character.title} · {zodiac.name_ko}</p>
          <p className="text-[15px] leading-relaxed text-ink-soft">{character.description}</p>
          {!owned && (
            <Button
              className="mt-2"
              onClick={() => {
                ownCharacter(character.id);
                toast(`${character.name}을(를) 획득했어요! ✨`);
              }}
            >
              캐릭터 획득하기
            </Button>
          )}
        </Card>

        {/* 능력치 */}
        <Card className="space-y-3 p-4">
          <p className="text-sm font-bold text-ink">능력치</p>
          {(Object.keys(character.stats) as (keyof typeof character.stats)[]).map((k) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-ink-soft">{STAT_LABEL[k]}</span>
                <span className="font-bold text-ink">{character.stats[k]}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-elevated">
                <div className="h-full rounded-full" style={{ width: `${character.stats[k]}%`, background: character.theme_color }} />
              </div>
            </div>
          ))}
        </Card>

        {/* 관련 굿즈 */}
        {goods.length > 0 && (
          <section>
            <h3 className="mb-2 px-1 text-sm font-bold text-ink">관련 굿즈</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {goods.map((p) => (
                <Link key={p.id} href={`/shop/${p.id}`} className="shrink-0">
                  <Card className="w-32 p-3">
                    <div className="mb-2 h-20 rounded-lg" style={{ background: `linear-gradient(135deg, ${p.theme_color}, #0D1028)` }} />
                    <p className="truncate text-xs font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-accent">{formatKRW(p.price)}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
