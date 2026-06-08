# MINI STAR ATLAS — 모바일 UX/UI 설계서 (30 Screens)

> 기준: 모바일 우선 / 컨테이너 `max-width 480px` 중앙 정렬 / 다크 판타지 갤럭시 톤
> 디자인 키워드: Disney · Genshin Impact · Honkai Star Rail · Pokémon · Fantasy Galaxy

---

## 0. Design Tokens (Foundation)

### 0.1 Color

| Token | Hex | 용도 |
|-------|-----|------|
| `--bg-base` | `#050816` | 앱 최하단 배경 |
| `--bg-surface` | `#0D1028` | 카드/패널 (Primary) |
| `--bg-elevated` | `#161B3D` | 떠 있는 카드/모달 |
| `--accent` | `#E8C76A` | 주요 액션·CTA·강조 (Gold) |
| `--accent-soft` | `#F3E2A8` | accent hover/light |
| `--secondary` | `#7B61FF` | 보조 강조·별빛·마법 (Purple) |
| `--text-primary` | `#F5F6FF` | 본문 제목 |
| `--text-secondary` | `#A6ABC9` | 보조 텍스트 |
| `--text-muted` | `#6B7099` | 캡션/비활성 |
| `--border` | `#232A52` | 구분선·카드 테두리 |
| `--success` | `#4ADE80` | 성공/완료 |
| `--warning` | `#FBBF24` | 주의 |
| `--error` | `#FB7185` | 오류/위험 |
| `--info` | `#60A5FA` | 정보 |

**Rarity 색상**: `N #9CA3AF` · `R #60A5FA` · `SR #A78BFA` · `SSR #E8C76A` · `UR` = `linear-gradient(135deg,#FB7185,#E8C76A,#7B61FF)`

**Element 색상**: Fire `#FB7185` · Earth `#86C28B` · Air `#93C5FD` · Water `#7B61FF`

### 0.2 Typography
- Font: `Pretendard` (KR) → fallback `Geist`, sans-serif
- Scale(px/line): Display 32/40 · H1 28/36 · H2 24/32 · H3 20/28 · Title 18/26 · Body 16/24 · Body-sm 14/20 · Caption 12/16 · Overline 11/14(letter-spacing .08em, uppercase)
- Weight: 400 / 500 / 600 / 700

### 0.3 Spacing (4pt grid)
`2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`
화면 좌우 패딩 기본 `16`. 섹션 간 `24~32`.

### 0.4 Radius / Shadow / Motion
- Radius: `sm 8` · `md 12` · `lg 16` · `xl 24` · `pill 999`
- Shadow: card `0 4 24 rgba(0,0,0,.4)` · glow-gold `0 0 24 rgba(232,199,106,.35)` · glow-purple `0 0 28 rgba(123,97,255,.45)`
- Motion: fast 150ms · base 250ms · slow 400ms · easing `cubic-bezier(.4,0,.2,1)` · star-twinkle `3s ease-in-out infinite`

### 0.5 Layout System
- TopBar 56px · BottomNav 64px · safe-area inset 반영
- Z-index: base 0 · sticky 10 · bottomNav 40 · modal 50 · toast 60
- BottomNav 5탭: **홈 · 월드맵 · 궁합 · 굿즈 · MY**

### 0.6 공통 컴포넌트(원자)
`Starfield`(배경 별 애니메이션) · `Button(primary/ghost/outline)` · `Card` · `Input` · `Badge` · `ProgressBar` · `Avatar(gradient)` · `ZodiacIcon` · `RarityTag` · `BottomNav` · `TopBar` · `EmptyState` · `Skeleton` · `Toast`

### 0.7 공통 상태 패턴
- **Loading**: `Skeleton`(카드/리스트 회색 펄스) + 중앙 별빛 스피너
- **Empty**: 일러스트(작은 별) + 안내 문구 + 액션 버튼
- **Error**: 에러 아이콘 + 메시지 + `다시 시도` 버튼 (네트워크/권한 구분)

---

## 화면 인덱스 (30)

| # | 화면 | 그룹 | 라우트 |
|---|------|------|--------|
| 01 | Splash | Splash | `/` |
| 02 | Onboarding–Intro | Onboarding | `/onboarding` |
| 03 | Onboarding–Worldview | Onboarding | `/onboarding` |
| 04 | Onboarding–Birthday | Onboarding | `/onboarding` |
| 05 | Sign Up | Onboarding | `/signup` |
| 06 | Login | Onboarding | `/login` |
| 07 | Zodiac Reveal | Zodiac | `/reveal/zodiac` |
| 08 | Character Reveal | Character | `/reveal/character` |
| 09 | Home | Home | `/home` |
| 10 | Today's Fortune | Home | `/home/fortune` |
| 11 | Zodiac List | Zodiac | `/zodiac` |
| 12 | Zodiac Detail | Zodiac | `/zodiac/[code]` |
| 13 | Character Collection | Character | `/characters` |
| 14 | Character Detail | Character | `/characters/[id]` |
| 15 | World Map | World Map | `/worldmap` |
| 16 | Kingdom Detail | World Map | `/worldmap/[id]` |
| 17 | NPC Dialog | World Map | `/worldmap/[id]/npc` |
| 18 | Quest List | Quest | `/quest` |
| 19 | Quest Detail | Quest | `/quest/[id]` |
| 20 | Quest Reward | Quest | modal |
| 21 | Growth / Level | Home | `/growth` |
| 22 | Compatibility–Input | (궁합) | `/compatibility` |
| 23 | Compatibility–Result | (궁합) | `/compatibility/result` |
| 24 | Goods Shop List | Goods Shop | `/shop` |
| 25 | Product Detail | Goods Shop | `/shop/[id]` |
| 26 | Cart | Goods Shop | `/shop/cart` |
| 27 | Checkout | Goods Shop | `/shop/checkout` |
| 28 | Event List | Event | `/events` |
| 29 | Event Detail (Ticket) | Event | `/events/[id]` |
| 30 | My Page | My Page | `/mypage` |

---

## 화면별 상세 설계

> 각 화면: **Layout / Component Tree / UX Flow / Empty / Loading / Error**

### 01. Splash
- **Layout**: 전체 화면 갤럭시 그라데이션, 중앙 로고 + 별빛 파티클, 하단 버전 표기.
- **Tree**: `Splash > Starfield · Logo(animated) · Tagline · VersionText`
- **UX Flow**: 앱 진입 → 1.5s 로고 트윈클 → 세션 확인 → (로그인됨)`/home` · (비로그인)`/onboarding`
- **Empty**: 없음(항상 로고)
- **Loading**: 로고 자체가 로딩 인디케이터(별 펄스)
- **Error**: 세션 확인 실패 시 `/onboarding`으로 폴백

### 02. Onboarding – Intro
- **Layout**: 상단 큰 일러스트, 중앙 H1 카피, 하단 `시작하기` 버튼 + 페이지 인디케이터(●○○).
- **Tree**: `OnboardingSlide > Starfield · HeroArt · Title · Desc · PageDots · PrimaryButton · SkipLink`
- **UX Flow**: 스와이프/버튼으로 03→04 진행, `건너뛰기`→`/signup`
- **Empty/Loading/Error**: 정적 화면 — 해당 없음(이미지 lazy load 시 Skeleton)

### 03. Onboarding – Worldview
- **Layout**: 12별자리 왕국 미리보기 캐러셀 + 세계관 설명.
- **Tree**: `OnboardingSlide > KingdomCarousel(Card×n) · Title · Desc · PageDots · NextButton`
- **UX Flow**: 캐러셀 자동 슬라이드, `다음`→04
- **Loading**: 캐러셀 Skeleton 카드 3장

### 04. Onboarding – Birthday Prompt
- **Layout**: 생일 입력 유도 일러스트 + "생일로 별자리를 찾아드려요" + `내 별자리 찾기` CTA.
- **Tree**: `OnboardingSlide > HeroArt · Title · Desc · PrimaryButton(→signup)`
- **UX Flow**: CTA → `/signup`

### 05. Sign Up
- **Layout**: TopBar(뒤로) · 폼(이메일/비밀번호/닉네임/생년월일) · 약관 체크 · `가입하기`.
- **Tree**: `SignupPage > TopBar · Starfield · Form{ Input(email) · Input(password) · Input(nickname) · DatePicker(birthday) · Checkbox(terms) · SubmitButton } · LoginLink`
- **UX Flow**: 입력→유효성 검사→Supabase `signUp`(metadata: nickname/birthday)→이메일 확인 안내→로그인 후 `07 Zodiac Reveal`
- **Empty**: 초기 빈 폼(placeholder)
- **Loading**: Submit 시 버튼 spinner + disabled
- **Error**: 필드별 인라인 에러(중복 이메일/닉네임, 약한 비밀번호), 상단 Toast

### 06. Login
- **Layout**: 로고 · 이메일/비밀번호 · `로그인` · `회원가입` 링크.
- **Tree**: `LoginPage > Starfield · Logo · Form{ Input×2 · SubmitButton } · SignupLink`
- **UX Flow**: Supabase `signInWithPassword`→성공 `/home`
- **Loading**: 버튼 spinner
- **Error**: "이메일 또는 비밀번호가 올바르지 않습니다" Toast

### 07. Zodiac Reveal
- **Layout**: 풀스크린 연출 — 별자리 콘스텔레이션 라인 그리기 애니메이션 → 별자리명·심볼 등장.
- **Tree**: `ZodiacReveal > Starfield · ConstellationAnim · ZodiacSymbol · ZodiacName(name_ko) · ElementBadge · NextButton`
- **UX Flow**: 가입 직후 자동 진입 → 연출 2~3s → `다음`→ `08`
- **Loading**: 별자리 데이터 로드까지 콘스텔레이션 점만 표시
- **Error**: 데이터 실패 시 기본 별자리 카드로 폴백 + 재시도

### 08. Character Reveal
- **Layout**: 캐릭터 실루엣 → 빛 번짐 → 캐릭터 일러스트 + Rarity 연출(SSR 금빛).
- **Tree**: `CharacterReveal > Starfield · RarityBurst · CharacterArt · CharacterName · RarityTag · Title · CTA(→home)`
- **UX Flow**: 연출 후 `모험 시작`→`/home`
- **Loading**: 실루엣 placeholder
- **Error**: 기본 캐릭터 카드 폴백

### 09. Home
- **Layout(세로 스크롤)**: TopBar(닉네임·StarPoint·알림) → ① 캐릭터 히어로 카드 → ② 오늘의 운세 카드 → ③ 레벨/경험치 바 → ④ 오늘의 퀘스트 리스트(3) → ⑤ 월드맵 바로가기. BottomNav.
- **Tree**: `HomePage > TopBar · Starfield · CharacterHeroCard · FortuneCard · LevelBar · QuestPreviewList(QuestItem×3) · WorldMapShortcut · BottomNav`
- **UX Flow**: 진입 시 user/quests fetch → 카드 탭으로 각 상세 이동
- **Empty**: 퀘스트 없음 → "오늘의 퀘스트가 모두 완료됐어요 🎉"
- **Loading**: 각 카드 Skeleton
- **Error**: 섹션별 `다시 시도` 인라인

### 10. Today's Fortune
- **Layout**: 별자리 심볼 헤더 · 총운 점수(원형 게이지) · 카테고리별(애정/금전/건강/행운) 카드 · 행운의 아이템.
- **Tree**: `FortunePage > TopBar · ZodiacHeader · ScoreGauge · FortuneCategoryCard×4 · LuckyItem · ShareButton`
- **UX Flow**: 홈 운세카드 탭→진입, `공유` 가능
- **Empty**: 운세 미생성 → "오늘의 운세를 불러오는 중"
- **Loading**: 게이지/카드 Skeleton
- **Error**: 재시도 버튼

### 11. Zodiac List
- **Layout**: 3열 그리드, 12별자리 카드(심볼·이름·날짜범위), 본인 별자리 상단 하이라이트.
- **Tree**: `ZodiacListPage > TopBar · MyZodiacBanner · ZodiacGrid(ZodiacCard×12) · BottomNav`
- **UX Flow**: 카드 탭→`12 Zodiac Detail`
- **Loading**: 12 Skeleton 카드
- **Error**: 전체 재시도

### 12. Zodiac Detail
- **Layout**: 헤더(심볼·이름·기간·원소·지배행성) · 성격 설명 · 수호 캐릭터 카드 · 연결된 왕국 바로가기.
- **Tree**: `ZodiacDetail > TopBar(back) · ZodiacHero · TraitSection · CharacterMiniCard(→14) · KingdomShortcut(→16)`
- **Empty**: 설명 미등록 → "준비 중인 별자리예요"
- **Loading**: Hero Skeleton
- **Error**: 404 → 목록으로

### 13. Character Collection (도감)
- **Layout**: 2열 그리드 카드(보유=컬러/미보유=실루엣+잠금), 상단 보유율 ProgressBar, Rarity 필터 칩.
- **Tree**: `CharacterCollection > TopBar · CollectionProgress · FilterChips · CharacterGrid(CharacterCard×12) · BottomNav`
- **UX Flow**: 보유 카드 탭→`14`, 미보유 탭→획득 조건 툴팁
- **Empty**: 필터 결과 없음 → "해당 등급 캐릭터가 없어요"
- **Loading**: Skeleton 그리드
- **Error**: 재시도

### 14. Character Detail
- **Layout**: 풀블리드 캐릭터 아트 · 이름/타이틀/Rarity · 스토리 · 능력치(테마컬러 바) · 관련 굿즈 캐러셀.
- **Tree**: `CharacterDetail > TopBar · CharacterArtHeader · RarityTag · StorySection · StatBars · RelatedGoods(ProductCard×n) · FavoriteButton`
- **UX Flow**: 관련 굿즈 탭→`25`
- **Empty**: 굿즈 없음 → 캐러셀 숨김
- **Loading**: 아트 Skeleton + 텍스트 라인
- **Error**: 404 폴백

### 15. World Map
- **Layout**: 인터랙티브 갤럭시 맵, 12 왕국 노드(별자리 심볼), 잠금/해금 상태, 현재 위치 핀. 핀치 줌(선택).
- **Tree**: `WorldMapPage > TopBar · Starfield · MapCanvas{ KingdomNode×12 · UserPin } · KingdomPreviewSheet · BottomNav`
- **UX Flow**: 노드 탭→하단 미리보기 시트→`자세히`→`16`
- **Empty**: 해금 왕국 없음 → 본인 별자리 왕국만 활성
- **Loading**: 맵 Skeleton(노드 펄스)
- **Error**: 맵 로드 실패 → 리스트 폴백 뷰

### 16. Kingdom Detail
- **Layout**: 왕국 배경 일러스트 · 이름/설명 · NPC 카드 · 왕국 퀘스트 리스트.
- **Tree**: `KingdomDetail > TopBar(back) · KingdomHero · LoreSection · NpcCard(→17) · KingdomQuestList(QuestItem×n)`
- **UX Flow**: NPC 탭→`17`, 퀘스트 탭→`19`
- **Empty**: 퀘스트 없음 → "곧 새로운 임무가 열려요"
- **Loading**: Hero + 리스트 Skeleton
- **Error**: 404 폴백

### 17. NPC Dialog
- **Layout**: 비주얼 노벨식 — 하단 대사 박스(타이핑 효과) · NPC 초상 · `다음`/선택지.
- **Tree**: `NpcDialog > Backdrop · NpcPortrait · DialogBox(typewriter) · ChoiceButtons · SkipButton`
- **UX Flow**: 대사 진행→선택지→퀘스트 수락→`19`
- **Loading**: 초상 Skeleton
- **Error**: 대사 로드 실패 → 닫고 왕국으로

### 18. Quest List
- **Layout**: 탭(일일/메인/초대/이벤트) · 퀘스트 카드(제목·보상 EXP/Star·진행바·상태버튼).
- **Tree**: `QuestPage > TopBar · QuestTabs · QuestList(QuestCard×n){ rewardChips · ProgressBar · ActionButton } · BottomNav`
- **UX Flow**: `수령`→보상 모달`20`, 카드 탭→`19`
- **Empty**: 탭별 "완료한 퀘스트만 있어요" / "진행 가능한 퀘스트가 없어요"
- **Loading**: 카드 Skeleton×4
- **Error**: 재시도

### 19. Quest Detail
- **Layout**: 퀘스트 타이틀 · 스토리 설명 · 목표 체크리스트 · 보상 미리보기 · `완료/수령` CTA.
- **Tree**: `QuestDetail > TopBar · QuestHeader · ObjectiveChecklist · RewardPreview · ActionButton`
- **UX Flow**: 조건 충족→`수령`→`20`→리스트 갱신
- **Empty**: 목표 없음 → 단순 보상 수령형
- **Loading**: Skeleton
- **Error**: 수령 실패 Toast + 재시도

### 20. Quest Reward (Modal)
- **Layout**: 중앙 모달 — 보상 연출(코인/별 튀는 애니) · 획득 EXP·StarPoint · 레벨업 시 추가 연출.
- **Tree**: `RewardModal > Overlay · BurstAnim · RewardItem(exp/star) · LevelUpBadge? · ConfirmButton`
- **UX Flow**: `확인`→닫기, 레벨업이면 `21`로 유도
- **Loading**: 즉시 표시(데이터는 이미 수령됨)
- **Error**: 표시 실패 시 Toast로 대체

### 21. Growth / Level
- **Layout**: 캐릭터 + 레벨 원형 게이지 · 다음 레벨까지 EXP · 누적 통계 · 경험치 획득처 안내(로그인/퀘스트/초대).
- **Tree**: `GrowthPage > TopBar · LevelRing · ExpBar · StatGrid · ExpSourceList · InviteButton`
- **UX Flow**: `친구 초대`→공유 시트
- **Empty**: 통계 0 → "모험을 시작해 경험치를 모아보세요"
- **Loading**: 게이지 Skeleton
- **Error**: 재시도

### 22. Compatibility – Input
- **Layout**: 두 개의 생일 입력(나/상대) · 관계 유형 선택(우정/연애/비즈니스) · `궁합 보기`.
- **Tree**: `CompatInput > TopBar · DatePicker(me, prefilled) · DatePicker(partner) · RelationTypeTabs · SubmitButton · BottomNav`
- **UX Flow**: 입력→계산→`23`
- **Empty**: 상대 생일 미입력 시 CTA 비활성
- **Loading**: 버튼 spinner
- **Error**: 잘못된 날짜 인라인 에러

### 23. Compatibility – Result
- **Layout**: 두 별자리 심볼 + 하트/연결 애니 · 총점(0~100) 원형 게이지 · 유형별 코멘트 · 추천 한마디 · `공유`.
- **Tree**: `CompatResult > TopBar · ZodiacPair · ScoreGauge · CommentCard · AdviceCard · ShareButton · RetryButton`
- **Empty**: 해당 없음(항상 점수 산출)
- **Loading**: 게이지 Skeleton
- **Error**: 계산 실패 → 입력으로 복귀

### 24. Goods Shop List
- **Layout**: 카테고리 칩(인형/키링/포토카드/피규어) · 2열 상품 그리드(이미지·이름·가격·담기) · 우상단 장바구니 아이콘(뱃지).
- **Tree**: `ShopPage > TopBar(cartIcon+badge) · CategoryChips · ProductGrid(ProductCard×n) · BottomNav`
- **UX Flow**: 카드 탭→`25`, `담기`→카트 수량+토스트, 장바구니→`26`
- **Empty**: 카테고리 비었을 때 "상품 준비 중이에요"
- **Loading**: Skeleton 그리드
- **Error**: 재시도

### 25. Product Detail
- **Layout**: 상품 이미지 캐러셀 · 이름/가격/설명 · 연결 캐릭터 · 수량 스텝퍼 · 하단 고정 `장바구니 담기`/`바로 구매`.
- **Tree**: `ProductDetail > TopBar(cart) · ImageCarousel · PriceBlock · DescSection · CharacterLink(→14) · QtyStepper · StickyCTA{addToCart · buyNow}`
- **UX Flow**: 담기→토스트, 바로구매→`27`
- **Empty**: 품절 시 CTA→`품절` 비활성
- **Loading**: 이미지 Skeleton
- **Error**: 404 폴백

### 26. Cart
- **Layout**: 장바구니 아이템 리스트(썸네일·이름·가격·수량·삭제) · 합계 요약 · `주문하기`.
- **Tree**: `CartPage > TopBar · CartItemList(CartItem×n){ QtyStepper · RemoveButton } · PriceSummary · CheckoutButton`
- **UX Flow**: 수량 변경/삭제 즉시 반영→`주문하기`→`27`
- **Empty**: 빈 카트 → 일러스트 + "담은 굿즈가 없어요" + `굿즈 보러가기`
- **Loading**: 리스트 Skeleton
- **Error**: 동기화 실패 Toast

### 27. Checkout
- **Layout**: 배송지 입력(이름/연락처/주소) · 주문 상품 요약 · 결제수단(목업) · 최종 금액 · `결제하기`.
- **Tree**: `CheckoutPage > TopBar · ShippingForm · OrderSummary · PaymentMethod · TotalBlock · PayButton`
- **UX Flow**: 검증→orders/order_items 생성→완료 화면/토스트→`홈` 또는 주문내역
- **Empty**: 상품 없음 → 카트로 복귀
- **Loading**: `결제하기` spinner
- **Error**: 필드 인라인 에러 + 결제 실패 Toast

### 28. Event List
- **Layout**: 상단 추천 배너(카루셀) · 공연 카드 리스트(포스터·제목·일시·장소·상태뱃지 upcoming/onsale/soldout).
- **Tree**: `EventListPage > TopBar · FeaturedCarousel · EventCard×n{ poster · meta · StatusBadge } · BottomNav`
- **UX Flow**: 카드 탭→`29`
- **Empty**: "예정된 공연이 없어요" 일러스트
- **Loading**: 배너+카드 Skeleton
- **Error**: 재시도

### 29. Event Detail (Ticket)
- **Layout**: 포스터 헤더 · 제목/일시/장소(지도 링크) · 공연 설명 · 가격/잔여 · 하단 고정 `티켓 예매`(외부링크/내부발권).
- **Tree**: `EventDetail > TopBar · PosterHeader · EventMeta · MapLink · DescSection · StickyCTA(ticket)`
- **UX Flow**: `티켓 예매`→내부 발권(tickets insert) 또는 ticket_url 외부 이동
- **Empty**: 매진 시 CTA→`매진` 비활성
- **Loading**: 포스터 Skeleton
- **Error**: 404 / 예매 실패 Toast

### 30. My Page
- **Layout**: 프로필 헤더(아바타·닉네임·별자리·레벨) · StarPoint · 메뉴 그리드(컬렉션/배지/주문내역/티켓/설정) · 배지 미리보기 · `로그아웃`.
- **Tree**: `MyPage > TopBar · ProfileHeader · StatRow(level·star·collection%) · MenuGrid · BadgePreview(Badge×n) · LogoutButton · BottomNav`
- **UX Flow**: 메뉴→각 상세(컬렉션 `13`, 주문내역, 티켓함), 로그아웃→`/login`
- **Empty**: 배지 없음 → "첫 배지를 모아보세요"
- **Loading**: 프로필 Skeleton
- **Error**: 프로필 로드 실패 → 재시도

---

## UX Flow 전체 흐름 (요약)

```
Splash
 ├─(로그인됨)→ Home
 └─(비로그인)→ Onboarding(Intro→Worldview→Birthday)→ Sign Up
                                                       └→ Zodiac Reveal → Character Reveal → Home
Login ↔ Sign Up

Home ─┬→ Today's Fortune
      ├→ Growth/Level
      ├→ [BottomNav] World Map → Kingdom Detail → NPC Dialog → Quest Detail → Quest Reward
      ├→ [BottomNav] Compatibility(Input→Result)
      ├→ [BottomNav] Goods Shop → Product Detail → Cart → Checkout
      ├→ Event List → Event Detail(Ticket)
      └→ [BottomNav] My Page → Collection / Character Detail / Badges / Orders / Tickets
Zodiac List ↔ Zodiac Detail ↔ Character Detail
```
