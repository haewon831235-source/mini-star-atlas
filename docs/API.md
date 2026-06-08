# MINI STAR ATLAS — API 설계

본 앱은 **Supabase 클라이언트 SDK + RLS**를 기본 데이터 액세스 계층으로 사용합니다.
별도의 백엔드 서버 없이, RLS 정책이 인가(authorization)를 담당합니다.
(Supabase 미설정 시 클라이언트는 자동으로 localStorage **데모 모드**로 동작)

---

## 1. 인증 (Auth)

| 동작 | Supabase SDK | 앱 내부 API (`useUser`) |
|------|--------------|--------------------------|
| 회원가입 | `auth.signUp({ email, password, options:{ data:{ nickname, birthday } } })` | `signUp({ email, password, nickname, birthday })` |
| 로그인 | `auth.signInWithPassword({ email, password })` | `signIn(email, password)` |
| 로그아웃 | `auth.signOut()` | `signOut()` |
| 세션 조회 | `auth.getSession()` | (Provider 마운트 시 자동) |

- 회원가입 시 DB 트리거 `handle_new_user()` 가 `auth.users` → `public.users` 행을 자동 생성하고
  **생일로 별자리·수호 캐릭터를 자동 부여**합니다.

---

## 2. 데이터 액세스 패턴 (Supabase Query)

> 모든 쿼리는 RLS 정책 하에서 실행됩니다. 마스터 데이터는 공개 읽기, 유저 데이터는 본인만.

### 2.1 마스터 데이터 (읽기 전용)
```ts
const { data } = await supabase.from("zodiacs").select("*").order("id");
const { data } = await supabase.from("characters").select("*");
const { data } = await supabase.from("kingdoms").select("*").order("sort_order");
const { data } = await supabase.from("quests").select("*").eq("is_active", true);
const { data } = await supabase.from("products").select("*").eq("category", "doll");
const { data } = await supabase.from("events").select("*").order("starts_at");
```

### 2.2 내 프로필
```ts
const { data } = await supabase.from("users").select("*").eq("id", uid).single();
await supabase.from("users").update({ experience, level, star_points }).eq("id", uid);
```

### 2.3 퀘스트 진행 / 업적
```ts
await supabase.from("user_quests").upsert({ user_id, quest_id, status: "claimed" });
await supabase.from("user_achievements").insert({ user_id, achievement_id });
```

### 2.4 주문 (orders + order_items)
```ts
const { data: order } = await supabase
  .from("orders").insert({ user_id, total_amount, status: "pending" }).select().single();
await supabase.from("order_items").insert(
  items.map(i => ({ order_id: order.id, product_id: i.product.id, quantity: i.quantity, unit_price: i.product.price }))
);
```

### 2.5 티켓
```ts
await supabase.from("tickets").insert({ event_id, user_id, price, status: "reserved" });
```

---

## 3. 앱 내부 상태 API (Context Stores)

| Store | 노출 메서드 | 설명 |
|-------|-------------|------|
| `useUser()` | `profile, loading, mode` | 현재 사용자 / 로딩 / supabase·demo |
| | `signUp, signIn, signOut` | 인증 |
| | `addExp(n)` | 경험치 추가 + 자동 레벨업 |
| | `addStar(n)` | 스타포인트 추가 |
| | `completeQuest(id, exp, star)` | 퀘스트 완료 + 보상 |
| | `ownCharacter(id)` | 캐릭터 도감 등록 |
| | `earnBadge(id)` | 배지 획득 |
| `useCart()` | `items, count, total` | 장바구니 상태 |
| | `add, remove, setQty, clear` | 장바구니 조작 |
| `useToast()` | `toast(message)` | 토스트 알림 |

---

## 4. (선택) Route Handler 설계

서버 사이드 로직이 필요할 때 `app/api/*/route.ts` 로 확장할 수 있습니다.

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/fortune?zodiac=5` | 오늘의 운세 (현재는 클라이언트 `lib/zodiac.ts` 로 계산) |
| `POST` | `/api/compatibility` | 궁합 계산 (body: `{ birthdayA, birthdayB, relation }`) |
| `POST` | `/api/orders` | 주문 생성 (서버에서 금액 재검증) |

> Next.js 16 기준: Route Handler 에서 `cookies()`/`headers()` 는 `await` 필요.

---

## 5. 도메인 로직 (`src/lib/zodiac.ts`)

| 함수 | 시그니처 | 설명 |
|------|----------|------|
| `getZodiacByBirthday` | `(birthday) => Zodiac` | 생일 → 별자리 (염소자리 경계 처리) |
| `getDailyFortune` | `(zodiacId, dateSeed) => Fortune` | 결정론적 일일 운세 |
| `getCompatibility` | `(bdA, bdB, relation) => CompatibilityResult` | 원소 궁합 + 시드 (0~100) |
