"use client";

import { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useUser } from "@/store/user-provider";
import { useToast } from "@/store/toast-provider";
import { QUESTS } from "@/data/quests";
import type { QuestType } from "@/types";
import { cn } from "@/lib/utils";

const TABS: { key: QuestType; label: string }[] = [
  { key: "daily", label: "일일" },
  { key: "main", label: "메인" },
  { key: "invite", label: "초대" },
  { key: "event", label: "이벤트" },
];

export default function QuestPage() {
  const { profile, completeQuest } = useUser();
  const toast = useToast();
  const [tab, setTab] = useState<QuestType>("daily");
  if (!profile) return null;

  const list = QUESTS.filter((q) => q.type === tab);

  const claim = (id: string, exp: number, star: number) => {
    completeQuest(id, exp, star);
    toast(`퀘스트 완료! +${exp} EXP · +${star} ⭐`);
  };

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={25} />
      <TopBar title="퀘스트" />
      <div className="relative z-10 px-4 py-4">
        <div className="mb-4 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
                tab === t.key ? "bg-accent text-night" : "bg-elevated text-ink-soft",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState title="진행 가능한 퀘스트가 없어요" description="곧 새로운 임무가 열려요!" />
        ) : (
          <div className="space-y-3">
            {list.map((q) => {
              const done = profile.completedQuestIds.includes(q.id);
              return (
                <Card key={q.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-ink">{q.title}</p>
                      <p className="mt-0.5 text-sm text-ink-muted">{q.description}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="rounded-full bg-elevated px-2 py-0.5 text-xs font-semibold text-accent">+{q.reward_exp} EXP</span>
                        <span className="rounded-full bg-elevated px-2 py-0.5 text-xs font-semibold text-accent">+{q.reward_star} ⭐</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={done ? "ghost" : "primary"}
                      disabled={done}
                      onClick={() => claim(q.id, q.reward_exp, q.reward_star)}
                    >
                      {done ? "완료" : "수령"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
