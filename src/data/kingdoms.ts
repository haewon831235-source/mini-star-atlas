import type { Kingdom } from "@/types";

/** 12 왕국 (별자리별) */
export const KINGDOMS: Kingdom[] = [
  { id: "kd-aries", zodiac_id: 1, name: "불꽃의 왕국 아리에스", sort_order: 1,
    description: "끝없는 화산과 붉은 사막의 땅. 용맹한 전사들이 검을 단련하는 곳.",
    npc_name: "대장장이 이그니스", npc_dialog: "여행자여, 두려움 없이 불 속으로 뛰어들 준비가 됐나?" },
  { id: "kd-taurus", zodiac_id: 2, name: "대지의 왕국 타우로스", sort_order: 2,
    description: "황금 들판과 거대한 숲이 펼쳐진 풍요의 땅.",
    npc_name: "농부 가이아", npc_dialog: "서두르지 말게. 좋은 결실은 기다림에서 오는 법이야." },
  { id: "kd-gemini", zodiac_id: 3, name: "바람의 왕국 게미니", sort_order: 3,
    description: "구름 위에 떠 있는 쌍둥이 도시. 소문과 지식이 바람을 타고 흐른다.",
    npc_name: "전령 제피르", npc_dialog: "재미있는 이야기 하나 들려줄까? 대신 너의 이야기도 들려줘." },
  { id: "kd-cancer", zodiac_id: 4, name: "달빛의 왕국 캔서", sort_order: 4,
    description: "은빛 조수가 드나드는 해안 왕국. 달이 뜨면 마법이 강해진다.",
    npc_name: "치유사 셀레네", npc_dialog: "지친 마음을 이리 주렴. 달빛이 보듬어 줄 거야." },
  { id: "kd-leo", zodiac_id: 5, name: "태양의 왕국 레오니스", sort_order: 5,
    description: "황금빛 궁전이 빛나는 왕국. 가장 용감한 자가 왕좌에 앉는다.",
    npc_name: "근위대장 솔", npc_dialog: "고개를 들어라. 너도 이 무대의 주인공이 될 수 있다." },
  { id: "kd-virgo", zodiac_id: 6, name: "기록의 왕국 비르고", sort_order: 6,
    description: "끝없는 도서관과 수정탑의 왕국. 우주의 모든 지식이 보관된다.",
    npc_name: "사서 아스트라", npc_dialog: "찾는 답이 있니? 여기엔 없는 기록이 없단다." },
  { id: "kd-libra", zodiac_id: 7, name: "조화의 왕국 리브라", sort_order: 7,
    description: "공중 정원과 거대한 저울탑이 있는 우아한 왕국.",
    npc_name: "심판관 에퀼", npc_dialog: "모든 일에는 균형이 필요해. 너의 저울은 어느 쪽이지?" },
  { id: "kd-scorpio", zodiac_id: 8, name: "심연의 왕국 스콜피오", sort_order: 8,
    description: "안개 낀 늪과 비밀의 동굴이 가득한 어두운 왕국.",
    npc_name: "추적자 베놈", npc_dialog: "진실을 원한다면 어둠을 두려워하지 마라." },
  { id: "kd-sagittarius", zodiac_id: 9, name: "지평의 왕국 사지타", sort_order: 9,
    description: "끝없는 초원과 별빛 지평선의 왕국. 모험가들의 출발점.",
    npc_name: "궁수 호라이즌", npc_dialog: "다음 모험은 어디로? 지평선 너머가 우릴 부른다!" },
  { id: "kd-capricorn", zodiac_id: 10, name: "산정의 왕국 카프리", sort_order: 10,
    description: "구름을 뚫고 솟은 설산의 왕국. 정상에 오른 자만이 진실을 본다.",
    npc_name: "현자 서밋", npc_dialog: "정상은 멀지만, 한 걸음씩이면 닿는다." },
  { id: "kd-aquarius", zodiac_id: 11, name: "은하의 왕국 아쿠아", sort_order: 11,
    description: "별 사이를 항해하는 떠다니는 왕국. 미래의 기술이 태어나는 곳.",
    npc_name: "항해사 벨라", npc_dialog: "새로운 길을 함께 그려보지 않을래?" },
  { id: "kd-pisces", zodiac_id: 12, name: "심해의 왕국 피스케스", sort_order: 12,
    description: "꿈과 현실이 뒤섞인 신비로운 바다 왕국.",
    npc_name: "몽상가 루나", npc_dialog: "꿈을 믿니? 이곳에선 꿈이 곧 현실이란다." },
];

export const getKingdomById = (id: string) => KINGDOMS.find((k) => k.id === id);
export const getKingdomByZodiac = (zodiacId: number) =>
  KINGDOMS.find((k) => k.zodiac_id === zodiacId);
