import type { Zodiac } from "@/types";

/** 12 별자리 마스터 데이터 */
export const ZODIACS: Zodiac[] = [
  {
    id: 1, code: "aries", name_en: "Aries", name_ko: "양자리", symbol: "♈",
    element: "fire", ruling_planet: "화성", start_month: 3, start_day: 21, end_month: 4, end_day: 19,
    description: "불꽃처럼 타오르는 개척자. 두려움 없이 가장 먼저 길을 여는 별.",
    traits: ["열정", "용기", "리더십", "직진"],
  },
  {
    id: 2, code: "taurus", name_en: "Taurus", name_ko: "황소자리", symbol: "♉",
    element: "earth", ruling_planet: "금성", start_month: 4, start_day: 20, end_month: 5, end_day: 20,
    description: "흔들리지 않는 대지의 수호자. 끈기와 안정으로 결실을 맺는 별.",
    traits: ["인내", "안정", "감각", "성실"],
  },
  {
    id: 3, code: "gemini", name_en: "Gemini", name_ko: "쌍둥이자리", symbol: "♊",
    element: "air", ruling_planet: "수성", start_month: 5, start_day: 21, end_month: 6, end_day: 21,
    description: "바람처럼 자유로운 쌍성. 호기심과 재치로 세상을 잇는 별.",
    traits: ["재치", "소통", "호기심", "다재다능"],
  },
  {
    id: 4, code: "cancer", name_en: "Cancer", name_ko: "게자리", symbol: "♋",
    element: "water", ruling_planet: "달", start_month: 6, start_day: 22, end_month: 7, end_day: 22,
    description: "달빛으로 마음을 보듬는 수호자. 깊은 감수성과 보호 본능의 별.",
    traits: ["공감", "보호", "직관", "다정"],
  },
  {
    id: 5, code: "leo", name_en: "Leo", name_ko: "사자자리", symbol: "♌",
    element: "fire", ruling_planet: "태양", start_month: 7, start_day: 23, end_month: 8, end_day: 22,
    description: "태양을 닮은 무대의 왕. 당당한 자신감으로 빛나는 별.",
    traits: ["자신감", "관대함", "카리스마", "당당함"],
  },
  {
    id: 6, code: "virgo", name_en: "Virgo", name_ko: "처녀자리", symbol: "♍",
    element: "earth", ruling_planet: "수성", start_month: 8, start_day: 23, end_month: 9, end_day: 22,
    description: "별의 기록을 정리하는 사서. 섬세함과 완벽주의의 별.",
    traits: ["분석", "섬세함", "헌신", "정확함"],
  },
  {
    id: 7, code: "libra", name_en: "Libra", name_ko: "천칭자리", symbol: "♎",
    element: "air", ruling_planet: "금성", start_month: 9, start_day: 23, end_month: 10, end_day: 22,
    description: "조화를 저울질하는 천사. 아름다움과 균형을 사랑하는 별.",
    traits: ["균형", "공정", "우아함", "사교성"],
  },
  {
    id: 8, code: "scorpio", name_en: "Scorpio", name_ko: "전갈자리", symbol: "♏",
    element: "water", ruling_planet: "명왕성", start_month: 10, start_day: 23, end_month: 11, end_day: 22,
    description: "심연을 지키는 파수꾼. 강렬한 집중과 비밀스러운 매력의 별.",
    traits: ["집중", "통찰", "열정", "신비"],
  },
  {
    id: 9, code: "sagittarius", name_en: "Sagittarius", name_ko: "사수자리", symbol: "♐",
    element: "fire", ruling_planet: "목성", start_month: 11, start_day: 23, end_month: 12, end_day: 21,
    description: "지평선을 향해 활을 겨누는 궁수. 자유와 모험을 좇는 별.",
    traits: ["모험", "낙천", "자유", "철학"],
  },
  {
    id: 10, code: "capricorn", name_en: "Capricorn", name_ko: "염소자리", symbol: "♑",
    element: "earth", ruling_planet: "토성", start_month: 12, start_day: 22, end_month: 1, end_day: 19,
    description: "산정에 오르는 현자. 책임감과 인내로 정상을 향하는 별.",
    traits: ["책임", "야망", "인내", "현명함"],
  },
  {
    id: 11, code: "aquarius", name_en: "Aquarius", name_ko: "물병자리", symbol: "♒",
    element: "air", ruling_planet: "천왕성", start_month: 1, start_day: 20, end_month: 2, end_day: 18,
    description: "은하를 항해하는 혁신가. 독창성과 박애로 미래를 그리는 별.",
    traits: ["독창성", "자유", "박애", "혁신"],
  },
  {
    id: 12, code: "pisces", name_en: "Pisces", name_ko: "물고기자리", symbol: "♓",
    element: "water", ruling_planet: "해왕성", start_month: 2, start_day: 19, end_month: 3, end_day: 20,
    description: "심해를 떠도는 몽상가. 무한한 상상력과 공감의 별.",
    traits: ["상상력", "공감", "예술성", "헌신"],
  },
];

export const getZodiacById = (id: number) => ZODIACS.find((z) => z.id === id);
export const getZodiacByCode = (code: string) => ZODIACS.find((z) => z.code === code);
