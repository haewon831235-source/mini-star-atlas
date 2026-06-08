import type { Product } from "@/types";

/** 굿즈샵 상품 더미 데이터 */
export const PRODUCTS: Product[] = [
  { id: "pd-luna-doll", name: "Luna 인형", description: "심해의 수호자 Luna의 폭신한 50cm 인형.", price: 38000, category: "doll", character_id: "char-pisces", stock: 24, theme_color: "#7B61FF" },
  { id: "pd-leo-doll", name: "Leo 인형", description: "태양의 사자 Leo의 황금 갈기 인형.", price: 38000, category: "doll", character_id: "char-leo", stock: 18, theme_color: "#E8C76A" },
  { id: "pd-arion-keyring", name: "Arion 키링", description: "불꽃의 기사 Arion 아크릴 키링.", price: 9000, category: "keyring", character_id: "char-aries", stock: 120, theme_color: "#FB7185" },
  { id: "pd-nox-keyring", name: "Nox 키링", description: "심연의 파수꾼 Nox 메탈 키링.", price: 11000, category: "keyring", character_id: "char-scorpio", stock: 90, theme_color: "#7B61FF" },
  { id: "pd-zodiac-photo", name: "12별자리 포토카드 세트", description: "12 수호 캐릭터 풀세트 포토카드.", price: 15000, category: "photocard", stock: 200, theme_color: "#E8C76A" },
  { id: "pd-luna-photo", name: "Luna 포토카드", description: "한정판 Luna 홀로그램 포토카드.", price: 4000, category: "photocard", character_id: "char-pisces", stock: 300, theme_color: "#7B61FF" },
  { id: "pd-leo-figure", name: "Leo 피규어", description: "태양의 사자 Leo 18cm 디오라마 피규어.", price: 89000, category: "figure", character_id: "char-leo", stock: 12, theme_color: "#E8C76A" },
  { id: "pd-mira-figure", name: "Mira 피규어", description: "바람의 쌍성 Mira 넨도로이드 피규어.", price: 65000, category: "figure", character_id: "char-gemini", stock: 0, theme_color: "#93C5FD" },
  { id: "pd-star-badge", name: "스타 아틀라스 뱃지 세트", description: "별자리 엠블럼 핀뱃지 4종.", price: 12000, category: "etc", stock: 150, theme_color: "#A78BFA" },
];

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
