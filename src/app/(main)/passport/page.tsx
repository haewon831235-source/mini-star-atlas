"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Sparkles, Star, Ticket } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CharacterAvatar } from "@/components/character-avatar";
import { useUser } from "@/store/user-provider";
import { useToast } from "@/store/toast-provider";
import { getCharacterById } from "@/data/characters";
import { TIERS, tierForPoints, nextTierInfo } from "@/data/tiers";
import type { Coupon, Tier } from "@/types";

// 등급별 할인 쿠폰 정의 (현재 등급에서 1회 발급).
const TIER_COUPON: Record<string, { title: string; value: string }> = {
  bronze: { title: "브론즈 등급 3% 할인", value: "3%" },
  silver: { title: "실버 등급 5% 할인", value: "5%" },
  gold: { title: "골드 등급 10% 할인", value: "10%" },
};

export default function PassportPage() {
  const { profile, addStamp, issueCoupon, redeemCoupon } = useUser();
  const t = useTranslations("Passport");
  const locale = useLocale();
  const toast = useToast();
  if (!profile) return null;

  const character = getCharacterById(profile.character_id)!;
  const points = profile.star_points;
  const tier = tierForPoints(points);
  const { next, remaining } = nextTierInfo(points);

  const tierName = (tr: Tier) => (locale === "ko" ? tr.name_ko : tr.name_en);
  const tierBenefits = (tr: Tier) => (locale === "ko" ? tr.benefits_ko : tr.benefits_en);
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(locale);

  // 스탬프: 10칸 카드. 현재 카드의 채워진 칸 수를 계산.
  const stamps = profile.passportStamps ?? [];
  const total = stamps.length;
  const fullCards = Math.floor(total / 10);
  const inCard = total === 0 ? 0 : total % 10 === 0 ? 10 : total % 10;
  const cardBase = total === 0 ? 0 : total % 10 === 0 ? total - 10 : fullCards * 10;
  const slots = Array.from({ length: 10 }, (_, i) => (i < inCard ? stamps[cardBase + i] : null));

  // 쿠폰: 만료일이 지난 active 쿠폰은 만료로 표시. active 먼저 정렬.
  const now = Date.now();
  const displayStatus = (c: Coupon) =>
    c.status === "active" && new Date(c.expiresAt).getTime() < now ? "expired" : c.status;
  const coupons = [...(profile.coupons ?? [])].sort((a, b) => {
    const rank = (c: Coupon) => (displayStatus(c) === "active" ? 0 : 1);
    return rank(a) - rank(b);
  });

  const history = (profile.passportHistory ?? []).slice(0, 20);

  const tierCoupon = TIER_COUPON[tier.id];
  const tierCouponClaimed = (profile.coupons ?? []).some((c) => c.source === `tier-${tier.id}`);

  const claimTierCoupon = () => {
    if (!tierCoupon) return;
    issueCoupon({
      title: tierCoupon.title,
      kind: "discount",
      value: tierCoupon.value,
      days: 30,
      source: `tier-${tier.id}`,
    });
    toast("쿠폰이 발급됐어요 🎟️");
  };

  const onAddStamp = () => {
    addStamp("admin");
    toast("스탬프를 적립했어요 ⭐");
  };

  const onUseCoupon = (c: Coupon) => {
    redeemCoupon(c.id);
    toast("쿠폰을 사용 처리했어요");
  };

  return (
    <main className="relative min-h-[100dvh] pb-24">
      <Starfield count={30} />
      <TopBar title={t("title")} />
      <div className="relative z-10 space-y-5 px-4 py-4">
        {/* 상단 요약 카드 */}
        <Card className="gradient-galaxy p-5">
          <div className="flex items-center gap-4">
            <CharacterAvatar character={character} size={64} />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold text-ink">{profile.nickname}</p>
              <span
                className="mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{ backgroundColor: `${tier.color}22`, color: tier.color }}
              >
                {tier.icon} {tierName(tier)}
              </span>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-xl font-extrabold text-accent">
                <Star size={16} /> {points}
              </p>
              <p className="text-[11px] text-ink-muted">{t("points")}</p>
            </div>
          </div>

          {/* 스탬프 진행바 */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-ink-soft">{t("stampCard")}</span>
              <span className="font-bold text-accent">{inCard}/10</span>
            </div>
            <Progress value={(inCard / 10) * 100} />
          </div>
        </Card>

        {/* 스탬프 패널 */}
        <section>
          <h3 className="mb-2 px-1 text-sm font-bold text-ink">{t("stampCard")}</h3>
          <Card className="p-4">
            <div className="grid grid-cols-5 gap-3">
              {slots.map((stamp, i) => (
                <div
                  key={i}
                  title={
                    stamp
                      ? `${fmtDate(stamp.at)}${stamp.label ? ` · ${stamp.label}` : ""}`
                      : undefined
                  }
                  className={
                    stamp
                      ? "flex aspect-square items-center justify-center rounded-full border border-accent/60 bg-accent/15 text-accent glow-gold animate-pulse"
                      : "flex aspect-square items-center justify-center rounded-full border border-dashed border-line bg-elevated/50 text-ink-muted"
                  }
                >
                  {stamp ? <Star size={18} fill="currentColor" /> : <span className="text-xs">{i + 1}</span>}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-ink-muted">{t("stampHint")}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onAddStamp}>
              <Sparkles size={16} /> {t("addStampDemo")}
            </Button>
          </Card>
        </section>

        {/* 등급 혜택 */}
        <section>
          <h3 className="mb-2 px-1 text-sm font-bold text-ink">{t("tiersTitle")}</h3>
          <div className="space-y-3">
            {TIERS.map((tr) => {
              const isCurrent = tr.id === tier.id;
              return (
                <Card
                  key={tr.id}
                  className={isCurrent ? "border-accent/70 p-4 glow-gold" : "p-4 opacity-80"}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tr.icon}</span>
                      <span className="font-bold text-ink" style={{ color: isCurrent ? tr.color : undefined }}>
                        {tierName(tr)}
                      </span>
                    </div>
                    <span className="text-[11px] text-ink-muted">
                      {tr.max === Number.POSITIVE_INFINITY
                        ? `${tr.min.toLocaleString()}P+`
                        : `${tr.min.toLocaleString()}~${tr.max.toLocaleString()}P`}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {tierBenefits(tr).map((b) => (
                      <li key={b} className="flex items-center gap-1.5 text-xs text-ink-soft">
                        <Check size={13} className="text-success" /> {b}
                      </li>
                    ))}
                  </ul>
                  {isCurrent && tierCoupon && (
                    <Button
                      variant={tierCouponClaimed ? "ghost" : "secondary"}
                      size="sm"
                      className="mt-3 w-full"
                      disabled={tierCouponClaimed}
                      onClick={claimTierCoupon}
                    >
                      {tierCouponClaimed ? t("benefitClaimed") : t("claimBenefit")}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
          <p className="mt-2 px-1 text-center text-xs text-ink-muted">
            {next ? t("toNextTier", { tier: tierName(next), points: remaining.toLocaleString() }) : t("maxTier")}
          </p>
        </section>

        {/* 보유 쿠폰 */}
        <section>
          <h3 className="mb-2 px-1 text-sm font-bold text-ink">{t("couponsTitle")}</h3>
          {coupons.length === 0 ? (
            <Card className="p-6 text-center text-sm text-ink-muted">{t("noCoupons")}</Card>
          ) : (
            <div className="space-y-2">
              {coupons.map((c) => {
                const status = displayStatus(c);
                return (
                  <Card key={c.id} className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Ticket size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{c.title}</p>
                      <p className="text-[11px] text-ink-muted">
                        {c.code} · {t("validUntil", { date: fmtDate(c.expiresAt) })}
                      </p>
                    </div>
                    {status === "active" ? (
                      <Button size="sm" onClick={() => onUseCoupon(c)}>
                        {t("use")}
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-ink-muted">
                        {status === "used" ? t("used") : t("expired")}
                      </span>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* 활동 내역 */}
        <section>
          <h3 className="mb-2 px-1 text-sm font-bold text-ink">{t("historyTitle")}</h3>
          {history.length === 0 ? (
            <Card className="p-6 text-center text-sm text-ink-muted">{t("noHistory")}</Card>
          ) : (
            <Card className="divide-y divide-line/60 p-0">
              {history.map((h, i) => (
                <div key={`${h.at}-${i}`} className="flex items-center justify-between px-4 py-3">
                  <span className="min-w-0 truncate text-sm text-ink-soft">{h.detail}</span>
                  <span className="ml-3 shrink-0 text-[11px] text-ink-muted">{fmtDate(h.at)}</span>
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
