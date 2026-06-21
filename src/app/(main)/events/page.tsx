"use client";

import Link from "next/link";
import { MapPin, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EVENTS } from "@/data/events";
import { formatDateTime, cn } from "@/lib/utils";
import type { EventStatus } from "@/types";

export default function EventListPage() {
  const t = useTranslations("Events");

  const STATUS: Record<EventStatus, { label: string; cls: string }> = {
    upcoming: { label: t("status.upcoming"), cls: "bg-info/20 text-info" },
    onsale: { label: t("status.onsale"), cls: "bg-success/20 text-success" },
    soldout: { label: t("status.soldout"), cls: "bg-ink-muted/20 text-ink-muted" },
    ended: { label: t("status.ended"), cls: "bg-ink-muted/20 text-ink-muted" },
  };

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={30} />
      <TopBar title={t("title")} back />
      <div className="relative z-10 space-y-3 px-4 py-4">
        {EVENTS.map((e) => (
          <Link key={e.id} href={`/events/${e.id}`}>
            <Card className="overflow-hidden transition-transform active:scale-[0.99]">
              <div className="flex h-32 items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${e.theme_color}, #050816)` }}>
                🎤
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center gap-2">
                  <Badge className={cn(STATUS[e.status].cls)}>{STATUS[e.status].label}</Badge>
                </div>
                <p className="font-bold text-ink">{e.title}</p>
                <div className="mt-2 space-y-1 text-xs text-ink-muted">
                  <p className="flex items-center gap-1"><CalendarDays size={13} /> {formatDateTime(e.starts_at)}</p>
                  <p className="flex items-center gap-1"><MapPin size={13} /> {e.location}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
