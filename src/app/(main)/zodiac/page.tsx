"use client";

import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { useTranslations } from "next-intl";
import { useUser } from "@/store/user-provider";
import { ZODIACS, getZodiacById } from "@/data/zodiacs";

export default function ZodiacListPage() {
  const { profile } = useUser();
  const t = useTranslations("Zodiac");
  if (!profile) return null;
  const mine = getZodiacById(profile.zodiac_id)!;

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={30} />
      <TopBar title={t("title")} back />
      <div className="relative z-10 px-4 py-4">
        <Link href={`/zodiac/${mine.code}`}>
          <Card className="mb-4 flex items-center gap-4 border-accent/50 p-4 glow-gold">
            <ZodiacIcon zodiac={mine} size={56} />
            <div>
              <p className="text-xs text-accent">{t("myZodiac")}</p>
              <p className="text-lg font-extrabold text-ink">{mine.name_ko} {mine.symbol}</p>
            </div>
          </Card>
        </Link>

        <div className="grid grid-cols-3 gap-3">
          {ZODIACS.map((z) => (
            <Link key={z.id} href={`/zodiac/${z.code}`}>
              <Card className="flex flex-col items-center gap-2 p-3 transition-transform active:scale-[0.97]">
                <ZodiacIcon zodiac={z} size={44} />
                <p className="text-xs font-bold text-ink">{z.name_ko}</p>
                <p className="text-[10px] text-ink-muted">{z.start_month}/{z.start_day}~{z.end_month}/{z.end_day}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
