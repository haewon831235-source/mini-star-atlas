import type { Character } from "@/types";

/** 별자리별 수호 캐릭터 (zodiac_id 1:1) */
const RAW_CHARACTERS: Character[] = [
  { id: "char-aries", zodiac_id: 1, name: "Arion", title: "불꽃의 기사", rarity: "SR", theme_color: "#FB7185",
    description: "가장 먼저 어둠을 향해 검을 든 양자리의 수호자. 두려움을 모르는 불꽃의 화신.",
    stats: { power: 92, magic: 60, luck: 70, charm: 75 } },
  { id: "char-taurus", zodiac_id: 2, name: "Tauri", title: "대지의 수호자", rarity: "R", theme_color: "#86C28B",
    description: "흔들리지 않는 산처럼 동료를 지키는 황소자리의 방패.",
    stats: { power: 88, magic: 55, luck: 72, charm: 70 } },
  { id: "char-gemini", zodiac_id: 3, name: "Mira", title: "바람의 쌍성", rarity: "SR", theme_color: "#93C5FD",
    description: "두 개의 마음을 가진 쌍둥이자리의 전령. 바람을 타고 소식을 나른다.",
    stats: { power: 65, magic: 82, luck: 80, charm: 84 } },
  { id: "char-cancer", zodiac_id: 4, name: "Cara", title: "달빛 수호자", rarity: "R", theme_color: "#7B61FF",
    description: "달빛으로 상처를 어루만지는 게자리의 치유사.",
    stats: { power: 60, magic: 85, luck: 74, charm: 88 } },
  { id: "char-leo", zodiac_id: 5, name: "Leo", title: "태양의 사자", rarity: "SSR", theme_color: "#E8C76A",
    description: "무대 중앙에서 가장 밝게 빛나는 사자자리의 왕. 태양의 갈기를 두른 영웅.",
    stats: { power: 95, magic: 70, luck: 85, charm: 95 } },
  { id: "char-virgo", zodiac_id: 6, name: "Vira", title: "별의 사서", rarity: "R", theme_color: "#86C28B",
    description: "은하의 모든 기록을 정리하는 처녀자리의 현자.",
    stats: { power: 58, magic: 88, luck: 70, charm: 76 } },
  { id: "char-libra", zodiac_id: 7, name: "Astra", title: "균형의 천사", rarity: "SR", theme_color: "#93C5FD",
    description: "선과 악, 빛과 그림자를 저울질하는 천칭자리의 심판자.",
    stats: { power: 70, magic: 80, luck: 82, charm: 90 } },
  { id: "char-scorpio", zodiac_id: 8, name: "Nox", title: "심연의 파수꾼", rarity: "SSR", theme_color: "#7B61FF",
    description: "가장 깊은 어둠 속에서도 진실을 꿰뚫는 전갈자리의 추적자.",
    stats: { power: 90, magic: 92, luck: 68, charm: 80 } },
  { id: "char-sagittarius", zodiac_id: 9, name: "Arlo", title: "폭풍의 궁수", rarity: "SR", theme_color: "#FB7185",
    description: "지평선 너머를 향해 화살을 쏘는 사수자리의 모험가.",
    stats: { power: 84, magic: 66, luck: 90, charm: 78 } },
  { id: "char-capricorn", zodiac_id: 10, name: "Cairn", title: "산정의 현자", rarity: "R", theme_color: "#86C28B",
    description: "가장 높은 봉우리에 홀로 선 염소자리의 인내자.",
    stats: { power: 80, magic: 72, luck: 66, charm: 70 } },
  { id: "char-aquarius", zodiac_id: 11, name: "Vela", title: "은하의 항해사", rarity: "SR", theme_color: "#93C5FD",
    description: "별과 별 사이를 잇는 길을 그리는 물병자리의 개척자.",
    stats: { power: 68, magic: 86, luck: 84, charm: 82 } },
  { id: "char-pisces", zodiac_id: 12, name: "Luna", title: "심해의 수호자", rarity: "SSR", theme_color: "#7B61FF",
    description: "끝없는 상상의 바다를 다스리는 물고기자리의 몽상가. 모든 꿈이 시작되는 곳.",
    stats: { power: 62, magic: 96, luck: 88, charm: 92 } },
];

// image_url 을 /public/characters/{id}.png 로 자동 매핑.
// 파일이 없으면 CharacterAvatar 가 그라데이션 플레이스홀더로 폴백한다.
export const CHARACTERS: Character[] = RAW_CHARACTERS.map((c) => ({
  ...c,
  image_url: c.image_url ?? `/characters/${c.id}.png`,
}));

export const getCharacterById = (id: string) => CHARACTERS.find((c) => c.id === id);
export const getCharacterByZodiac = (zodiacId: number) =>
  CHARACTERS.find((c) => c.zodiac_id === zodiacId);
