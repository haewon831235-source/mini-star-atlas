import type { Tier } from "@/types";

// 팬 패스포트 등급 마스터 — 기존 별(star_points) 누적값 기준으로 산정.
export const TIERS: Tier[] = [
  {
    id: "bronze",
    name_ko: "브론즈",
    name_en: "Bronze",
    icon: "🥉",
    color: "#cd7f32",
    min: 0,
    max: 499,
    benefits_ko: ["3% 할인 쿠폰 (연 1회)"],
    benefits_en: ["3% off coupon (1/yr)"],
  },
  {
    id: "silver",
    name_ko: "실버",
    name_en: "Silver",
    icon: "🥈",
    color: "#c0c7d4",
    min: 500,
    max: 1999,
    benefits_ko: ["5% 할인", "신상품 사전 알림"],
    benefits_en: ["5% off", "Early new-arrival alerts"],
  },
  {
    id: "gold",
    name_ko: "골드",
    name_en: "Gold",
    icon: "🥇",
    color: "#e8c76a",
    min: 2000,
    max: Number.POSITIVE_INFINITY,
    benefits_ko: ["10% 할인", "한정판 굿즈 우선구매", "무료배송 쿠폰 (연 1회)"],
    benefits_en: ["10% off", "Priority limited-edition", "Free-shipping coupon (1/yr)"],
  },
];

export function tierForPoints(points: number): Tier {
  return TIERS.find((t) => points >= t.min && points <= t.max) ?? TIERS[0];
}

// 다음 등급과 그 등급까지 남은 포인트.
export function nextTierInfo(points: number): { next: Tier | null; remaining: number } {
  const idx = TIERS.findIndex((t) => points >= t.min && points <= t.max);
  const next = idx >= 0 && idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
  return { next, remaining: next ? Math.max(0, next.min - points) : 0 };
}
