"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getZodiacByBirthday } from "@/lib/zodiac";
import { getCharacterByZodiac } from "@/data/characters";
import { expForLevel } from "@/lib/utils";
import type { Coupon, CouponKind, StampSource, UserProfile } from "@/types";

const STORAGE_KEY = "msa.profile";
const AUTH_KEY = "msa.auth";

const STAMP_SOURCE_LABEL: Record<StampSource, string> = {
  purchase: "굿즈 구매",
  event: "공연 참여",
  quest: "퀘스트 완료",
  admin: "관리자 적립",
};

interface CouponInput {
  title: string;
  kind: CouponKind;
  value: string;
  days: number;
  source: string;
}

function makeCoupon(input: CouponInput): Coupon {
  const now = new Date();
  const expires = new Date(now.getTime() + input.days * 86_400_000);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return {
    id: `cp-${now.getTime()}-${rand}`,
    code: `PASS-${rand}`,
    title: input.title,
    kind: input.kind,
    value: input.value,
    issuedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: "active",
    source: input.source,
  };
}

interface SignUpInput {
  email: string;
  password: string;
  nickname: string;
  birthday: string;
}

interface UserContextValue {
  profile: UserProfile | null;
  loading: boolean;
  mode: "supabase" | "demo";
  signUp: (input: SignUpInput) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  addExp: (amount: number) => { leveledUp: boolean; newLevel: number };
  addStar: (amount: number) => void;
  completeQuest: (questId: string, exp: number, star: number) => void;
  ownCharacter: (characterId: string) => void;
  earnBadge: (badgeId: string) => void;
  addStamp: (source: StampSource, label?: string) => void;
  issueCoupon: (input: CouponInput) => void;
  redeemCoupon: (couponId: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

function buildProfile(input: Omit<SignUpInput, "password"> & { id: string }): UserProfile {
  const zodiac = getZodiacByBirthday(input.birthday);
  const guardian = getCharacterByZodiac(zodiac.id);
  return {
    id: input.id,
    email: input.email,
    nickname: input.nickname,
    birthday: input.birthday,
    zodiac_id: zodiac.id,
    character_id: guardian?.id ?? "char-pisces",
    level: 1,
    experience: 0,
    star_points: 100, // 가입 환영 선물
    ownedCharacterIds: guardian ? [guardian.id] : [],
    badgeIds: ["ac-first-login", "ac-zodiac"],
    completedQuestIds: [],
    passportStamps: [],
    coupons: [],
    passportHistory: [],
  };
}

function persist(profile: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (profile) localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function readStored(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const mode = isSupabaseConfigured() ? "supabase" : "demo";

  // 초기 세션 복원
  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const stored = readStored();

      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session && stored) {
          if (active) setProfile(stored);
        } else if (data.session && !stored) {
          // 세션은 있으나 로컬 진행 데이터 없음 → 메타데이터로 복원
          const u = data.session.user;
          const rebuilt = buildProfile({
            id: u.id,
            email: u.email ?? "",
            nickname: (u.user_metadata?.nickname as string) ?? "여행자",
            birthday: (u.user_metadata?.birthday as string) ?? "2000-01-01",
          });
          persist(rebuilt);
          if (active) setProfile(rebuilt);
        }
      } else {
        // 데모 모드
        const loggedIn = localStorage.getItem(AUTH_KEY) === "true";
        if (loggedIn && stored && active) setProfile(stored);
      }
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((next: UserProfile) => {
    setProfile(next);
    persist(next);
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const supabase = createClient();
    let id = `demo-${input.email}`;

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: { data: { nickname: input.nickname, birthday: input.birthday } },
      });
      if (error) return { error: error.message };
      if (data.user) id = data.user.id;
    }

    const newProfile = buildProfile({ id, ...input });
    update(newProfile);
    localStorage.setItem(AUTH_KEY, "true");
    return {};
  }, [update]);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      const stored = readStored();
      if (stored) update(stored);
      localStorage.setItem(AUTH_KEY, "true");
      return {};
    }
    // 데모 모드: 저장된 계정 이메일 일치 시 로그인
    const stored = readStored();
    if (stored && stored.email === email) {
      update(stored);
      localStorage.setItem(AUTH_KEY, "true");
      return {};
    }
    return { error: "가입된 계정이 없어요. 먼저 회원가입을 해주세요." };
  }, [update]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    localStorage.setItem(AUTH_KEY, "false");
    setProfile(null);
  }, []);

  const addStar = useCallback((amount: number) => {
    setProfile((p) => {
      if (!p) return p;
      const next = { ...p, star_points: p.star_points + amount };
      persist(next);
      return next;
    });
  }, []);

  const addExp = useCallback((amount: number) => {
    let result = { leveledUp: false, newLevel: profile?.level ?? 1 };
    setProfile((p) => {
      if (!p) return p;
      let level = p.level;
      let exp = p.experience + amount;
      let leveled = false;
      while (exp >= expForLevel(level)) {
        exp -= expForLevel(level);
        level += 1;
        leveled = true;
      }
      result = { leveledUp: leveled, newLevel: level };
      const next = { ...p, level, experience: exp };
      persist(next);
      return next;
    });
    return result;
  }, [profile?.level]);

  const completeQuest = useCallback((questId: string, exp: number, star: number) => {
    setProfile((p) => {
      if (!p || p.completedQuestIds.includes(questId)) return p;
      let level = p.level;
      let experience = p.experience + exp;
      while (experience >= expForLevel(level)) {
        experience -= expForLevel(level);
        level += 1;
      }
      const next: UserProfile = {
        ...p,
        level,
        experience,
        star_points: p.star_points + star,
        completedQuestIds: [...p.completedQuestIds, questId],
      };
      persist(next);
      return next;
    });
  }, []);

  const ownCharacter = useCallback((characterId: string) => {
    setProfile((p) => {
      if (!p || p.ownedCharacterIds.includes(characterId)) return p;
      const next = { ...p, ownedCharacterIds: [...p.ownedCharacterIds, characterId] };
      persist(next);
      return next;
    });
  }, []);

  const earnBadge = useCallback((badgeId: string) => {
    setProfile((p) => {
      if (!p || p.badgeIds.includes(badgeId)) return p;
      const next = { ...p, badgeIds: [...p.badgeIds, badgeId] };
      persist(next);
      return next;
    });
  }, []);

  // ── 팬 패스포트 ─────────────────────────────────────────
  // 스탬프 적립. 10칸을 채울 때마다 완성 보상 쿠폰을 자동 발급한다.
  const addStamp = useCallback((source: StampSource, label?: string) => {
    setProfile((p) => {
      if (!p) return p;
      const at = new Date().toISOString();
      const stamps = [...(p.passportStamps ?? []), { source, at, label }];
      const history = [
        { at, type: "stamp" as const, detail: label ?? STAMP_SOURCE_LABEL[source] },
        ...(p.passportHistory ?? []),
      ];
      let coupons = p.coupons ?? [];
      if (stamps.length % 10 === 0) {
        coupons = [
          makeCoupon({
            title: "스탬프 카드 완성 5,000원 할인",
            kind: "discount",
            value: "5000원",
            days: 30,
            source: `stamp-card-${stamps.length / 10}`,
          }),
          ...coupons,
        ];
        history.unshift({ at, type: "coupon" as const, detail: "스탬프 카드 완성 보상 쿠폰 발급" });
      }
      const next: UserProfile = { ...p, passportStamps: stamps, coupons, passportHistory: history };
      persist(next);
      return next;
    });
  }, []);

  // 쿠폰 발급 (source 키로 중복 발급 방지 — 멱등).
  const issueCoupon = useCallback((input: CouponInput) => {
    setProfile((p) => {
      if (!p) return p;
      if ((p.coupons ?? []).some((c) => c.source === input.source)) return p;
      const at = new Date().toISOString();
      const next: UserProfile = {
        ...p,
        coupons: [makeCoupon(input), ...(p.coupons ?? [])],
        passportHistory: [
          { at, type: "coupon" as const, detail: `${input.title} 발급` },
          ...(p.passportHistory ?? []),
        ],
      };
      persist(next);
      return next;
    });
  }, []);

  // 쿠폰 사용 처리.
  const redeemCoupon = useCallback((couponId: string) => {
    setProfile((p) => {
      if (!p) return p;
      const target = (p.coupons ?? []).find((c) => c.id === couponId);
      if (!target || target.status !== "active") return p;
      const at = new Date().toISOString();
      const next: UserProfile = {
        ...p,
        coupons: (p.coupons ?? []).map((c) =>
          c.id === couponId ? { ...c, status: "used" as const } : c,
        ),
        passportHistory: [
          { at, type: "coupon" as const, detail: `${target.title} 사용` },
          ...(p.passportHistory ?? []),
        ],
      };
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ profile, loading, mode, signUp, signIn, signOut, addExp, addStar, completeQuest, ownCharacter, earnBadge, addStamp, issueCoupon, redeemCoupon }),
    [profile, loading, mode, signUp, signIn, signOut, addExp, addStar, completeQuest, ownCharacter, earnBadge, addStamp, issueCoupon, redeemCoupon],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
