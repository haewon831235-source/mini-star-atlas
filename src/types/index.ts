// ============================================================
//  MINI STAR ATLAS — Shared Types (mirrors supabase/schema.sql)
// ============================================================

export type Rarity = "N" | "R" | "SR" | "SSR" | "UR";
export type Element = "fire" | "earth" | "air" | "water";
export type QuestType = "daily" | "main" | "invite" | "event";
export type QuestStatus = "in_progress" | "completed" | "claimed";
export type ProductCategory = "doll" | "keyring" | "photocard" | "figure" | "etc";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type EventStatus = "upcoming" | "onsale" | "soldout" | "ended";
export type TicketStatus = "reserved" | "paid" | "used" | "cancelled";
export type RelationType = "friend" | "love" | "business";

export interface Zodiac {
  id: number;
  code: string;
  name_en: string;
  name_ko: string;
  symbol: string;
  element: Element;
  ruling_planet: string;
  start_month: number;
  start_day: number;
  end_month: number;
  end_day: number;
  description: string;
  traits: string[];
}

export interface Character {
  id: string;
  zodiac_id: number;
  name: string;
  title: string;
  description: string;
  rarity: Rarity;
  image_url?: string;
  theme_color: string;
  stats: { power: number; magic: number; luck: number; charm: number };
}

export interface Kingdom {
  id: string;
  zodiac_id: number;
  name: string;
  description: string;
  image_url?: string;
  npc_name: string;
  npc_dialog: string;
  sort_order: number;
}

export interface Quest {
  id: string;
  code: string;
  title: string;
  description: string;
  type: QuestType;
  reward_exp: number;
  reward_star: number;
  kingdom_id?: string | null;
  is_active: boolean;
}

export interface UserQuest {
  quest_id: string;
  status: QuestStatus;
  progress: number;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  reward_star: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_url?: string;
  character_id?: string | null;
  stock: number;
  theme_color?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  venue: string;
  starts_at: string;
  poster_url?: string;
  ticket_url?: string;
  price: number;
  status: EventStatus;
  theme_color?: string;
}

// ── Fan Passport (팬 패스포트) ──────────────────────────────
export type StampSource = "purchase" | "event" | "quest" | "admin";
export type CouponKind = "discount" | "access";
export type CouponStatus = "active" | "used" | "expired";
export type PassportHistoryType = "stamp" | "point" | "coupon" | "tier";

export interface PassportStamp {
  source: StampSource;
  at: string; // ISO datetime
  label?: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  kind: CouponKind;
  value: string; // 예: "5000원", "5%", "free-shipping"
  issuedAt: string; // ISO datetime
  expiresAt: string; // ISO datetime
  status: CouponStatus;
  source?: string; // 발급 출처 키 (중복 발급 방지)
}

export interface PassportEntry {
  at: string; // ISO datetime
  type: PassportHistoryType;
  detail: string;
  amount?: number;
}

// 등급 마스터 (포인트 구간 기준)
export interface Tier {
  id: string;
  name_ko: string;
  name_en: string;
  icon: string;
  color: string;
  min: number;
  max: number;
  benefits_ko: string[];
  benefits_en: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  birthday: string; // ISO date
  zodiac_id: number;
  character_id: string;
  level: number;
  experience: number;
  star_points: number;
  avatar_url?: string;
  ownedCharacterIds: string[];
  badgeIds: string[];
  completedQuestIds: string[];
  // 팬 패스포트 (기존 프로필 호환을 위해 옵셔널)
  passportStamps?: PassportStamp[];
  coupons?: Coupon[];
  passportHistory?: PassportEntry[];
}

export interface Fortune {
  total: number;
  love: number;
  money: number;
  health: number;
  luck: number;
  message: string;
  luckyItem: string;
  luckyColor: string;
}

export interface CompatibilityResult {
  score: number;
  relation: RelationType;
  title: string;
  comment: string;
  advice: string;
}
