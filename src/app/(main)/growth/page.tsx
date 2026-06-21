"use client";

import { useTranslations } from "next-intl";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CharacterAvatar } from "@/components/character-avatar";
import { useUser } from "@/store/user-provider";
import { useToast } from "@/store/toast-provider";
import { getCharacterById } from "@/data/characters";
import { expForLevel } from "@/lib/utils";

export default function GrowthPage() {
  const { profile } = useUser();
  const toast = useToast();
  const t = useTranslations("Growth");
  if (!profile) return null;

  const character = getCharacterById(profile.character_id)!;
  const need = expForLevel(profile.level);
  const pct = Math.round((profile.experience / need) * 100);

  const SOURCES = [
    { label: t("sources.attendance"), exp: "+20 EXP", emoji: "📅" },
    { label: t("sources.quest"), exp: "+15~150 EXP", emoji: "⚔️" },
    { label: t("sources.invite"), exp: "+80 EXP", emoji: "🤝" },
  ];

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={30} />
      <TopBar title={t("title")} back />
      <div className="relative z-10 space-y-5 px-4 py-6">
        <Card className="flex flex-col items-center gap-4 p-6">
          <div
            className="relative flex h-40 w-40 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(var(--color-accent) ${pct * 3.6}deg, var(--color-elevated) 0deg)` }}
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-surface">
              <CharacterAvatar character={character} size={112} showRing={false} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-accent">Lv. {profile.level}</p>
            <p className="text-sm text-ink-muted">
              {t("toNextLevel", { exp: need - profile.experience })}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-xs text-ink-muted">{t("level")}</p>
            <p className="mt-1 text-xl font-extrabold text-ink">{profile.level}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-ink-muted">{t("totalExp")}</p>
            <p className="mt-1 text-xl font-extrabold text-ink">{profile.experience}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-ink-muted">{t("starPoints")}</p>
            <p className="mt-1 text-xl font-extrabold text-accent">{profile.star_points}</p>
          </Card>
        </div>

        <section>
          <h3 className="mb-2 px-1 text-sm font-bold text-ink">{t("howToEarn")}</h3>
          <div className="space-y-2">
            {SOURCES.map((s) => (
              <Card key={s.label} className="flex items-center gap-3 p-3">
                <span className="text-xl">{s.emoji}</span>
                <span className="flex-1 text-sm font-semibold text-ink">{s.label}</span>
                <span className="text-xs font-bold text-accent">{s.exp}</span>
              </Card>
            ))}
          </div>
        </section>

        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => toast("초대 링크가 복사됐어요! (데모)")}
        >
          {t("inviteBtn")}
        </Button>
      </div>
    </main>
  );
}
