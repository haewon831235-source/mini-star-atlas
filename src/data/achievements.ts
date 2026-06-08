import type { Achievement } from "@/types";

/** 업적/배지 더미 데이터 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: "ac-first-login", code: "FIRST_LOGIN", name: "별의 시작", description: "MINI STAR ATLAS에 처음 발을 들였어요.", icon: "✨", reward_star: 20 },
  { id: "ac-zodiac", code: "ZODIAC_FOUND", name: "나의 별자리", description: "수호 별자리를 부여받았어요.", icon: "🌟", reward_star: 30 },
  { id: "ac-level-5", code: "LEVEL_5", name: "떠오르는 별", description: "레벨 5에 도달했어요.", icon: "⭐", reward_star: 50 },
  { id: "ac-collector", code: "COLLECTOR_3", name: "별 수집가", description: "캐릭터 3명을 도감에 등록했어요.", icon: "📖", reward_star: 50 },
  { id: "ac-explorer", code: "EXPLORER", name: "왕국 탐험가", description: "왕국 3곳을 방문했어요.", icon: "🗺️", reward_star: 60 },
  { id: "ac-shopper", code: "FIRST_ORDER", name: "굿즈 입문", description: "첫 굿즈를 주문했어요.", icon: "🛍️", reward_star: 40 },
];

export const getAchievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id);
