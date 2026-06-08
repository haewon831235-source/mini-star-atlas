# 🌌 MINI STAR ATLAS

> 생일을 입력하면 **별자리와 수호 캐릭터**를 부여받고, 성장·세계관 탐험·궁합·굿즈·공연까지 즐기는 글로벌 IP 팬덤 플랫폼.

모바일 우선 · 다크 판타지 갤럭시 톤 (Disney · Genshin · Honkai Star Rail · Pokémon 무드)

---

## ✨ 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | React 19, TypeScript, **Tailwind CSS v4**, shadcn 스타일 컴포넌트 |
| Animation | Framer Motion, CSS Keyframes (별빛 트윈클) |
| Icons | lucide-react |
| Backend | **Supabase** (Auth · PostgreSQL · RLS) |
| 배포 | Vercel |
| AI(선택) | OpenAI API |

> Supabase 환경변수가 없으면 자동으로 **데모 모드(localStorage)** 로 완전 동작합니다. 바로 실행해 볼 수 있어요.

---

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. (선택) 환경변수 설정 — 비워두면 데모 모드
cp .env.local.example .env.local

# 3. 개발 서버
npm run dev
# → http://localhost:3000
```

---

## 🔑 Supabase 연결 (실제 인증/DB)

1. [supabase.com](https://supabase.com) 에서 프로젝트 생성
2. **SQL Editor** 에서 순서대로 실행:
   - `supabase/schema.sql` (테이블·트리거·인덱스·RLS)
   - `supabase/seed.sql` (별자리/캐릭터/왕국 등 기초 데이터)
3. **Settings → API** 에서 값 복사 후 `.env.local` 작성:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. `npm run dev` 재시작 → 실제 회원가입/로그인 동작

---

## 📁 폴더 구조

```
mini-star-atlas/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx              # Splash
│  │  ├─ onboarding/           # 온보딩
│  │  ├─ signup/ · login/      # 인증
│  │  ├─ reveal/               # 별자리·캐릭터 부여 연출
│  │  └─ (main)/               # 인증 후 영역 (하단 네비)
│  │     ├─ home/ (+fortune)   # 홈 · 오늘의 운세
│  │     ├─ growth/            # 성장 시스템
│  │     ├─ zodiac/[code]/     # 별자리 도감
│  │     ├─ characters/[id]/   # 캐릭터 도감
│  │     ├─ worldmap/[id]/     # 12 왕국 + NPC
│  │     ├─ quest/             # 퀘스트
│  │     ├─ compatibility/     # 궁합
│  │     ├─ shop/[id]/cart/checkout/  # 굿즈샵
│  │     ├─ events/[id]/       # 공연
│  │     └─ mypage/            # 마이페이지
│  ├─ components/              # UI·공통 컴포넌트
│  │  └─ ui/                   # Button, Card, Input, Badge, Progress
│  ├─ store/                   # 상태관리 (User·Cart·Toast Provider)
│  ├─ lib/                     # supabase, zodiac 로직, utils
│  ├─ data/                    # 더미 데이터 (zodiacs, characters, ...)
│  └─ types/                   # 공유 타입
├─ supabase/
│  ├─ schema.sql               # DB 스키마 + RLS
│  └─ seed.sql                 # 시드 데이터
└─ docs/
   ├─ design-spec.md           # 30개 화면 UX/UI 설계서
   └─ API.md                   # API/데이터 액세스 설계
```

---

## 🧩 주요 기능

- **회원가입/별자리 자동 분류** — 생일 → 12별자리 자동 계산 (염소자리 경계 처리)
- **수호 캐릭터** — 별자리별 1명, Rarity(N~UR), 능력치, 도감 수집
- **홈** — 오늘의 운세, 캐릭터 카드, 레벨/경험치, 일일 퀘스트
- **성장 시스템** — Level · EXP · Star Point, 자동 레벨업
- **월드맵** — 12 왕국 + NPC 대화 + 왕국 퀘스트
- **궁합** — 두 생일 → 우정/연애/비즈니스 점수(0~100)
- **굿즈샵** — 카테고리, 장바구니, 주문/결제(데모)
- **공연** — 목록·상세·티켓 예매 링크
- **마이페이지** — 프로필, 컬렉션, 배지, 메뉴

---

## 🗄️ 상태관리 구조

React Context 3종 (`src/store`):
- **UserProvider** — 사용자/인증/성장 (Supabase + localStorage 하이브리드)
- **CartProvider** — 장바구니 (localStorage 영속)
- **ToastProvider** — 토스트 알림

자세한 내용은 [`docs/API.md`](docs/API.md) 참고.

---

## 🎨 캐릭터 일러스트

기본은 테마색 그라데이션 플레이스홀더로 표시되며, `public/characters/{id}.png` 파일을 넣으면
**자동으로 실제 일러스트로 교체**됩니다 (없으면 그라데이션으로 폴백 — 절대 깨지지 않음).

**방법 A — AI 자동 생성 (OpenAI, BYOK)**
```bash
# .env.local 에 OPENAI_API_KEY=sk-... 추가 후
npm run gen:characters            # 없는 것만 생성 (12장)
npm run gen:characters -- --force  # 전부 다시 생성
```
> gpt-image-1, 1024×1024 투명 배경. 이미지당 약 $0.04~0.17.

**방법 B — 직접 업로드**
정사각형 PNG를 `public/characters/`에 캐릭터 id 파일명으로 저장 (`char-leo.png` 등).
파일명 표는 [`public/characters/README.md`](public/characters/README.md) 참고.

---

## ☁️ 배포 (Vercel)

```bash
npm i -g vercel        # 1회
vercel                 # 프리뷰 배포
vercel --prod          # 프로덕션 배포
```

또는 GitHub 저장소를 Vercel에 import → 환경변수(`NEXT_PUBLIC_SUPABASE_*`) 설정 → 자동 배포.

빌드 확인:
```bash
npm run build && npm start
```

---

## 📐 디자인 토큰 (요약)

| Token | 값 | 용도 |
|-------|-----|------|
| Background | `#050816` | 앱 배경 (`--color-night`) |
| Surface/Primary | `#0D1028` | 카드 |
| Accent | `#E8C76A` | CTA·강조 (Gold) |
| Secondary | `#7B61FF` | 보조·마법 (Purple) |

전체 토큰·30개 화면 설계는 [`docs/design-spec.md`](docs/design-spec.md) 참고.
