import { ZODIACS, getZodiacById } from "@/data/zodiacs";
import type { Zodiac, Fortune, RelationType, CompatibilityResult } from "@/types";

/** 생년월일(Date | ISO) → 별자리 */
export function getZodiacByBirthday(birthday: string | Date): Zodiac {
  const d = typeof birthday === "string" ? new Date(birthday) : birthday;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const found = ZODIACS.find(
    (z) =>
      (m === z.start_month && day >= z.start_day) ||
      (m === z.end_month && day <= z.end_day),
  );
  return found ?? ZODIACS[9]; // fallback: 염소자리(12→1 경계)
}

const LUCKY_ITEMS = ["은빛 목걸이", "별 모양 키링", "향초", "가죽 노트", "민트 사탕", "헤드폰", "포토카드", "유리병 편지"];
const LUCKY_COLORS = ["골드", "퍼플", "딥블루", "에메랄드", "로즈", "실버"];
const FORTUNE_MSGS = [
  "오늘은 작은 용기가 큰 행운을 부르는 날이에요.",
  "별들이 당신의 편입니다. 망설였던 일을 시작해 보세요.",
  "예상치 못한 곳에서 좋은 인연을 만날 수 있어요.",
  "잠시 멈춰 마음을 돌보면 길이 또렷해집니다.",
  "당신의 빛이 누군가에게 별이 되어 줄 거예요.",
];

/** 별자리 + 날짜 시드 기반 결정론적 운세 (외부 의존성 없이 동작) */
export function getDailyFortune(zodiacId: number, dateSeed: string): Fortune {
  let h = 0;
  const seed = `${zodiacId}-${dateSeed}`;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const pick = (min: number, salt: number) => min + ((h >> salt) % (100 - min + 1));

  const love = pick(40, 2);
  const money = pick(40, 5);
  const health = pick(40, 8);
  const luck = pick(40, 11);
  const total = Math.round((love + money + health + luck) / 4);

  return {
    total, love, money, health, luck,
    message: FORTUNE_MSGS[h % FORTUNE_MSGS.length],
    luckyItem: LUCKY_ITEMS[h % LUCKY_ITEMS.length],
    luckyColor: LUCKY_COLORS[(h >> 3) % LUCKY_COLORS.length],
  };
}

const RELATION_LABEL: Record<RelationType, string> = {
  friend: "우정",
  love: "연애",
  business: "비즈니스",
};

/** 두 생일 → 궁합 결과 (별자리 원소 + 시드 결합, 0~100) */
export function getCompatibility(
  birthdayA: string,
  birthdayB: string,
  relation: RelationType,
): CompatibilityResult {
  const za = getZodiacByBirthday(birthdayA);
  const zb = getZodiacByBirthday(birthdayB);

  // 원소 궁합 가중치
  const elementScore = (() => {
    if (za.element === zb.element) return 30;
    const harmony: Record<string, string[]> = {
      fire: ["air"], air: ["fire"], earth: ["water"], water: ["earth"],
    };
    return harmony[za.element]?.includes(zb.element) ? 25 : 12;
  })();

  let h = 0;
  const seed = `${za.id}-${zb.id}-${relation}`;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const base = 45 + (h % 35); // 45~79
  const score = Math.min(100, base + elementScore);

  const tier =
    score >= 85 ? "운명적인" : score >= 70 ? "꽤 잘 맞는" : score >= 55 ? "노력하면 좋은" : "서로 다른";

  return {
    score,
    relation,
    title: `${tier} ${RELATION_LABEL[relation]} 궁합`,
    comment: `${za.name_ko}(${za.element === zb.element ? "같은" : "다른"} 원소)와 ${zb.name_ko}의 만남. ${
      score >= 70 ? "서로의 빛을 키워주는 조합이에요." : "다름 속에서 배울 점이 많은 조합이에요."
    }`,
    advice:
      relation === "love"
        ? "솔직한 대화가 두 별을 더 가깝게 만들어요."
        : relation === "business"
        ? "역할을 명확히 나누면 시너지가 큽니다."
        : "작은 관심이 오래가는 우정을 만들어요.",
  };
}

export { getZodiacById };
