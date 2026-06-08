"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/store/toast-provider";
import { getEventById } from "@/data/events";
import { formatDateTime, formatKRW, cn } from "@/lib/utils";
import type { EventStatus } from "@/types";

const STATUS: Record<EventStatus, { label: string; cls: string }> = {
  upcoming: { label: "오픈 예정", cls: "bg-info/20 text-info" },
  onsale: { label: "예매중", cls: "bg-success/20 text-success" },
  soldout: { label: "매진", cls: "bg-ink-muted/20 text-ink-muted" },
  ended: { label: "종료", cls: "bg-ink-muted/20 text-ink-muted" },
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toast = useToast();
  const event = getEventById(id);
  if (!event) return notFound();
  const canBook = event.status === "onsale";

  return (
    <main className="relative min-h-[100dvh] pb-24">
      <Starfield count={25} />
      <TopBar title="공연 상세" back />
      <div className="relative z-10">
        <div className="flex h-52 items-center justify-center text-7xl" style={{ background: `linear-gradient(135deg, ${event.theme_color}, #050816)` }}>
          🎤
        </div>
        <div className="space-y-4 px-4 py-5">
          <div>
            <Badge className={cn(STATUS[event.status].cls)}>{STATUS[event.status].label}</Badge>
            <h2 className="mt-2 text-xl font-extrabold text-ink">{event.title}</h2>
          </div>
          <Card className="space-y-2 p-4 text-sm">
            <p className="flex items-center gap-2 text-ink-soft"><CalendarDays size={16} className="text-accent" /> {formatDateTime(event.starts_at)}</p>
            <p className="flex items-center gap-2 text-ink-soft"><MapPin size={16} className="text-accent" /> {event.location} · {event.venue}</p>
            <p className="flex items-center gap-2 text-ink-soft">🎟️ {formatKRW(event.price)}</p>
          </Card>
          <p className="text-[15px] leading-relaxed text-ink-soft">{event.description}</p>
        </div>
      </div>

      <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-line bg-surface/95 p-4 backdrop-blur">
        <Button
          size="lg"
          className="w-full"
          disabled={!canBook}
          onClick={() => {
            if (event.ticket_url) window.open(event.ticket_url, "_blank");
            toast("예매 페이지로 이동합니다 (데모)");
          }}
        >
          {event.status === "soldout" ? "매진" : event.status === "upcoming" ? "오픈 예정" : "티켓 예매"}
        </Button>
      </div>
    </main>
  );
}
