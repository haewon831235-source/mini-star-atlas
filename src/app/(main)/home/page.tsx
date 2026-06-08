"use client";

import Link from "next/link";
import { ChevronRight, Star, Sparkles, Map as MapIcon } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LevelBar } from "@/components/level-bar";
import { CharacterAvatar } from "@/components/character-avatar";
import { useUser } from "@/store/user-provider";
import { useToast } from "@/store/toast-provider";
import { getCharacterById } from "@/data/characters";
import { getZodiacById } from "@/data/zodiacs";
import { QUESTS } from "@/data/quests";
import { getDailyFortune } from "@/lib/zodiac";

export default function HomePage() {
  const { profile, completeQuest } = useUser();
  const toast = useToast();
  if (!profile) return null;

  const character = getCharacterById(profile.character_id)!;
  const zodiac = getZodiacById(profile.zodiac_id)!;
  const today = new Date().toISOString().slice(0, 10);
  const fortune = getDailyFortune(profile.zodiac_id, today);
  const dailyQuests = QUESTS.filter((q) => q.type === "daily").slice(0, 3);

  const claim = (id: string, exp: number, star: number) => {
    completeQuest(id, exp, star);
    toast(`퀘스트 완료! +${exp} EXP · +${star} ⭐`);
  };

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={30} />
      <TopBar
        title={`안녕하세요, ${profile.nickname}님`}
        right={
          <div className="flex items-center gap-1 rounded-full bg-elevated px-3 py-1.5 text-sm font-bold text-accent">
            <Star size={14} fill="currentColor" /> {profile.star_points}
          </div>
        }
      />

      <div className="relative z-10 space-y-4 px-4 py-4">
        {/* 캐릭터 히어로 */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4 p-4">
            <CharacterAvatar character={character} size={84} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-xl font-extrabold text-ink">{character.name}</h2>
                <span className="text-sm text-ink-muted">{zodiac.symbol}</span>
              </div>
              <p className="mb-3 text-xs text-accent">{character.title}</p>
              <LevelBar level={profile.level} experience={profile.experience} />
            </div>
          </div>
        </Card>

        {/* 오늘의 운세 */}
        <Link href="/home/fortune">
          <Card className="transition-transform active:scale-[0.99]">
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl gradient-gold text-night">
                <span className="text-2xl font-extrabold leading-none">{fortune.total}</span>
                <span className="text-[10px] font-bold">점</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-sm font-bold text-ink">
                  <Sparkles size={14} className="text-accent" /> 오늘의 운세
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{fortune.message}</p>
              </div>
              <ChevronRight className="text-ink-muted" />
            </div>
          </Card>
        </Link>

        {/* 오늘의 퀘스트 */}
        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-ink">오늘의 퀘스트</h3>
            <Link href="/quest" className="text-xs text-ink-muted">전체보기</Link>
          </div>
          <div className="space-y-2">
            {dailyQuests.map((q) => {
              const done = profile.completedQuestIds.includes(q.id);
              return (
                <Card key={q.id} className="flex items-center gap-3 p-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{q.title}</p>
                    <p className="text-xs text-ink-muted">+{q.reward_exp} EXP · +{q.reward_star} ⭐</p>
                  </div>
                  <Button
                    size="sm"
                    variant={done ? "ghost" : "primary"}
                    disabled={done}
                    onClick={() => claim(q.id, q.reward_exp, q.reward_star)}
                  >
                    {done ? "완료" : "수령"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 월드맵 바로가기 */}
        <Link href="/worldmap">
          <Card className="flex items-center gap-3 p-4 transition-transform active:scale-[0.99]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
              <MapIcon size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink">12 왕국 탐험하기</p>
              <p className="text-xs text-ink-muted">당신의 왕국이 기다려요</p>
            </div>
            <ChevronRight className="text-ink-muted" />
          </Card>
        </Link>
      </div>
    </main>
  );
}
