"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, Ticket, TrendingUp, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CharacterAvatar } from "@/components/character-avatar";
import { useUser } from "@/store/user-provider";
import { getCharacterById } from "@/data/characters";
import { getZodiacById } from "@/data/zodiacs";
import { CHARACTERS } from "@/data/characters";
import { ACHIEVEMENTS } from "@/data/achievements";

export default function MyPage() {
  const router = useRouter();
  const { profile, signOut } = useUser();
  const t = useTranslations("MyPage");
  if (!profile) return null;

  const character = getCharacterById(profile.character_id)!;
  const zodiac = getZodiacById(profile.zodiac_id)!;
  const collectionPct = Math.round((profile.ownedCharacterIds.length / CHARACTERS.length) * 100);
  const badges = ACHIEVEMENTS.filter((a) => profile.badgeIds.includes(a.id));

  const MENU = [
    { href: "/characters", label: t("menu.characters"), icon: BookOpen },
    { href: "/zodiac", label: t("menu.zodiac"), icon: Sparkles },
    { href: "/events", label: t("menu.events"), icon: Ticket },
    { href: "/growth", label: t("menu.growth"), icon: TrendingUp },
    { href: "/mypage/settings", label: t("menu.settings"), icon: Settings },
  ];

  const logout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={30} />
      <TopBar
        title={t("title")}
        right={
          <Link href="/mypage/settings" aria-label={t("menu.settings")} className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-elevated">
            <Settings size={20} />
          </Link>
        }
      />
      <div className="relative z-10 space-y-5 px-4 py-4">
        {/* 프로필 */}
        <Card className="flex items-center gap-4 p-5 gradient-galaxy">
          <CharacterAvatar character={character} size={72} />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold text-ink">{profile.nickname}</p>
            <p className="text-sm text-ink-soft">{zodiac.name_ko} {zodiac.symbol} · Lv.{profile.level}</p>
            <p className="mt-1 text-sm font-bold text-accent">⭐ {profile.star_points} Star Point</p>
          </div>
        </Card>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xs text-ink-muted">{t("level")}</p>
            <p className="mt-1 text-lg font-extrabold text-ink">{profile.level}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-ink-muted">{t("collection")}</p>
            <p className="mt-1 text-lg font-extrabold text-ink">{collectionPct}%</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-ink-muted">{t("badges")}</p>
            <p className="mt-1 text-lg font-extrabold text-ink">{badges.length}</p>
          </Card>
        </div>

        {/* 메뉴 */}
        <div className="grid grid-cols-2 gap-3">
          {MENU.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Card className="flex items-center gap-3 p-4 transition-transform active:scale-[0.98]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-semibold text-ink">{label}</span>
              </Card>
            </Link>
          ))}
        </div>

        {/* 배지 */}
        <section>
          <h3 className="mb-2 px-1 text-sm font-bold text-ink">{t("earnedBadges")}</h3>
          {badges.length === 0 ? (
            <Card className="p-6 text-center text-sm text-ink-muted">{t("noBadges")}</Card>
          ) : (
            <div className="flex flex-wrap gap-3">
              {badges.map((b) => (
                <Card key={b.id} className="flex w-[calc(50%-6px)] items-center gap-2 p-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{b.name}</p>
                    <p className="truncate text-xs text-ink-muted">{b.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut size={18} /> {t("logout")}
        </Button>
      </div>
    </main>
  );
}
