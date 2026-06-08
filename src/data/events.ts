import type { AppEvent } from "@/types";

/** 공연 더미 데이터 */
export const EVENTS: AppEvent[] = [
  { id: "ev-galaxy-2026", title: "MINI STAR ATLAS : GALAXY LIVE 2026", location: "서울 · 올림픽홀", venue: "KSPO DOME 옆 올림픽홀", starts_at: "2026-07-18T19:00:00+09:00", price: 88000, status: "onsale", theme_color: "#7B61FF", ticket_url: "https://example.com/ticket/galaxy-2026", description: "12 수호 캐릭터가 한 무대에! 별빛 가득한 첫 단독 라이브." },
  { id: "ev-summer-festa", title: "Star Summer Festa", location: "부산 · 벡스코", venue: "BEXCO 오디토리움", starts_at: "2026-08-09T18:00:00+09:00", price: 66000, status: "upcoming", theme_color: "#E8C76A", ticket_url: "https://example.com/ticket/summer-festa", description: "여름밤을 수놓는 야외 페스타. 팬 참여형 미니게임 포함." },
  { id: "ev-fanmeeting", title: "Luna & Leo 팬미팅", location: "서울 · 블루스퀘어", venue: "블루스퀘어 마스터카드홀", starts_at: "2026-06-28T15:00:00+09:00", price: 49000, status: "soldout", theme_color: "#FB7185", ticket_url: "https://example.com/ticket/fanmeeting", description: "최애 캐릭터와 가까이! 토크와 포토타임으로 구성된 팬미팅." },
  { id: "ev-winter-gala", title: "Winter Constellation Gala", location: "인천 · 인스파이어 아레나", venue: "INSPIRE ARENA", starts_at: "2026-12-20T18:00:00+09:00", price: 99000, status: "upcoming", theme_color: "#60A5FA", ticket_url: "https://example.com/ticket/winter-gala", description: "한 해를 마무리하는 대규모 갈라쇼. 12왕국 콘셉트 무대." },
];

export const getEventById = (id: string) => EVENTS.find((e) => e.id === id);
