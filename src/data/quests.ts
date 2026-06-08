import type { Quest } from "@/types";

/** 퀘스트 더미 데이터 */
export const QUESTS: Quest[] = [
  { id: "q-login", code: "DAILY_LOGIN", title: "별빛 출석", description: "오늘 앱에 로그인하기", type: "daily", reward_exp: 20, reward_star: 10, is_active: true },
  { id: "q-fortune", code: "DAILY_FORTUNE", title: "오늘의 운세 확인", description: "오늘의 운세를 열어보기", type: "daily", reward_exp: 15, reward_star: 5, is_active: true },
  { id: "q-explore", code: "DAILY_EXPLORE", title: "왕국 탐험", description: "월드맵에서 왕국 한 곳 방문하기", type: "daily", reward_exp: 25, reward_star: 10, kingdom_id: null, is_active: true },
  { id: "q-main-1", code: "MAIN_FIRST_STEP", title: "첫 번째 별의 부름", description: "수호 캐릭터와 처음 만나기", type: "main", reward_exp: 100, reward_star: 50, is_active: true },
  { id: "q-main-2", code: "MAIN_GUARDIAN", title: "수호자의 시험", description: "내 왕국의 NPC와 대화하기", type: "main", reward_exp: 120, reward_star: 60, kingdom_id: null, is_active: true },
  { id: "q-main-3", code: "MAIN_COLLECT", title: "별 수집가", description: "캐릭터 도감 3개 이상 확인하기", type: "main", reward_exp: 150, reward_star: 80, is_active: true },
  { id: "q-invite", code: "INVITE_FRIEND", title: "친구를 별자리로", description: "친구 1명 초대하기", type: "invite", reward_exp: 80, reward_star: 100, is_active: true },
  { id: "q-event", code: "EVENT_TICKET", title: "공연으로의 초대", description: "공연 한 개 자세히 보기", type: "event", reward_exp: 40, reward_star: 20, is_active: true },
];

export const getQuestById = (id: string) => QUESTS.find((q) => q.id === id);
