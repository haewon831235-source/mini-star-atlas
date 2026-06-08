-- ============================================================
--  MINI STAR ATLAS — Supabase PostgreSQL Schema
--  Tables: zodiacs, characters, kingdoms, users, quests,
--          user_quests, achievements, user_achievements,
--          products, orders, order_items, events, tickets
--  Run order: extensions → enums → tables → functions/triggers
--             → indexes → RLS policies → seed (seed.sql)
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. ENUM TYPES
-- ------------------------------------------------------------
do $$ begin
  create type rarity_t           as enum ('N','R','SR','SSR','UR');
  create type element_t          as enum ('fire','earth','air','water');
  create type quest_type_t       as enum ('daily','main','invite','event');
  create type quest_status_t     as enum ('in_progress','completed','claimed');
  create type product_category_t as enum ('doll','keyring','photocard','figure','etc');
  create type order_status_t     as enum ('pending','paid','shipped','delivered','cancelled');
  create type event_status_t     as enum ('upcoming','onsale','soldout','ended');
  create type ticket_status_t    as enum ('reserved','paid','used','cancelled');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- 2. REFERENCE TABLES (publicly readable, admin-only writes)
-- ------------------------------------------------------------

-- 2.1 zodiacs : 12 별자리 마스터
create table if not exists public.zodiacs (
  id            smallint primary key,            -- 1..12
  code          text     not null unique,        -- 'aries'
  name_en       text     not null,               -- 'Aries'
  name_ko       text     not null,               -- '양자리'
  symbol        text     not null,               -- ♈
  element       element_t not null,
  ruling_planet text,
  start_month   smallint not null check (start_month between 1 and 12),
  start_day     smallint not null check (start_day   between 1 and 31),
  end_month     smallint not null check (end_month   between 1 and 12),
  end_day       smallint not null check (end_day     between 1 and 31),
  description   text,
  created_at    timestamptz not null default now()
);

-- 2.2 characters : 별자리별 수호 캐릭터 (1:1)
create table if not exists public.characters (
  id          uuid primary key default gen_random_uuid(),
  zodiac_id   smallint not null unique references public.zodiacs(id) on delete cascade,
  name        text     not null,                 -- 'Luna'
  title       text,                              -- '심해의 수호자'
  description text,
  rarity      rarity_t not null default 'R',
  image_url   text,
  theme_color text,                              -- '#7B61FF'
  created_at  timestamptz not null default now()
);

-- 2.3 kingdoms : 12 왕국 (별자리별 1:1)
create table if not exists public.kingdoms (
  id          uuid primary key default gen_random_uuid(),
  zodiac_id   smallint not null unique references public.zodiacs(id) on delete cascade,
  name        text     not null,
  description text,
  image_url   text,
  npc_name    text,
  npc_dialog  text,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now()
);

-- 2.4 quests : 퀘스트 마스터
create table if not exists public.quests (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  title       text not null,
  description text,
  type        quest_type_t not null default 'daily',
  reward_exp  int  not null default 0 check (reward_exp  >= 0),
  reward_star int  not null default 0 check (reward_star >= 0),
  kingdom_id  uuid references public.kingdoms(id) on delete set null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 2.5 achievements : 업적/배지 마스터
create table if not exists public.achievements (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  name           text not null,
  description    text,
  icon           text,
  condition_type text,                           -- 'level' | 'quest_count' | 'login_streak' | 'collection'
  condition_value int,
  reward_star    int not null default 0 check (reward_star >= 0),
  created_at     timestamptz not null default now()
);

-- 2.6 products : 굿즈샵 상품
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  price        integer not null check (price >= 0),     -- KRW
  category     product_category_t not null default 'etc',
  image_url    text,
  character_id uuid references public.characters(id) on delete set null,
  stock        int not null default 0 check (stock >= 0),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 2.7 events : 공연
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  location    text not null,
  venue       text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  poster_url  text,
  ticket_url  text,
  price       integer default 0 check (price >= 0),
  capacity    int,
  status      event_status_t not null default 'upcoming',
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. USER-OWNED TABLES
-- ------------------------------------------------------------

-- 3.1 users : auth.users 1:1 프로필 확장
create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null unique,
  nickname     text not null unique,
  birthday     date not null,
  zodiac_id    smallint references public.zodiacs(id),
  character_id uuid     references public.characters(id),
  level        int  not null default 1  check (level >= 1),
  experience   int  not null default 0  check (experience >= 0),
  star_points  int  not null default 0  check (star_points >= 0),
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 3.2 user_quests : 유저-퀘스트 진행 (M:N)
create table if not exists public.user_quests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id)  on delete cascade,
  quest_id     uuid not null references public.quests(id) on delete cascade,
  status       quest_status_t not null default 'in_progress',
  progress     int not null default 0 check (progress >= 0),
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (user_id, quest_id)
);

-- 3.3 user_achievements : 유저-업적 (M:N)
create table if not exists public.user_achievements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id)        on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at      timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- 3.4 orders : 주문 헤더
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  status           order_status_t not null default 'pending',
  total_amount     integer not null default 0 check (total_amount >= 0),
  shipping_name    text,
  shipping_phone   text,
  shipping_address text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 3.5 order_items : 주문 라인 (orders 1:N)
create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id)   on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity   int not null default 1 check (quantity > 0),
  unit_price integer not null check (unit_price >= 0)
);

-- 3.6 tickets : 공연 티켓 (events 1:N, users 1:N)
create table if not exists public.tickets (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  user_id      uuid not null references public.users(id)  on delete cascade,
  seat         text,
  price        integer not null default 0 check (price >= 0),
  status       ticket_status_t not null default 'reserved',
  purchased_at timestamptz not null default now(),
  unique (event_id, user_id, seat)
);

-- ------------------------------------------------------------
-- 4. FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------

-- 4.1 생일(date) → 별자리 id 자동 계산 (염소자리 12→1 경계 포함)
create or replace function public.get_zodiac_id(bd date)
returns smallint
language sql immutable
as $$
  select z.id from public.zodiacs z
  where
    (extract(month from bd)::int = z.start_month and extract(day from bd)::int >= z.start_day)
    or
    (extract(month from bd)::int = z.end_month   and extract(day from bd)::int <= z.end_day)
  limit 1;
$$;

-- 4.2 회원가입 시 auth.users → public.users 자동 생성 + 별자리/캐릭터 부여
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_birthday date;
  v_zodiac   smallint;
  v_char     uuid;
begin
  v_birthday := nullif(new.raw_user_meta_data->>'birthday','')::date;
  v_zodiac   := public.get_zodiac_id(coalesce(v_birthday, date '2000-01-01'));
  select id into v_char from public.characters where zodiac_id = v_zodiac limit 1;

  insert into public.users (id, email, nickname, birthday, zodiac_id, character_id)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'nickname',''), split_part(new.email,'@',1)),
    coalesce(v_birthday, date '2000-01-01'),
    v_zodiac,
    v_char
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4.3 updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_users_updated  on public.users;
create trigger trg_users_updated  before update on public.users  for each row execute function public.set_updated_at();
drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. INDEX STRATEGY
--   원칙: ① 모든 FK 컬럼  ② 정렬/필터 컬럼  ③ 부분(partial) 인덱스로
--        is_active=true 같은 핫 경로만 색인하여 인덱스 크기 절감
-- ------------------------------------------------------------
create index if not exists idx_characters_zodiac   on public.characters(zodiac_id);
create index if not exists idx_kingdoms_zodiac     on public.kingdoms(zodiac_id);
create index if not exists idx_kingdoms_sort       on public.kingdoms(sort_order);

create index if not exists idx_users_zodiac        on public.users(zodiac_id);
create index if not exists idx_users_character     on public.users(character_id);

create index if not exists idx_quests_kingdom      on public.quests(kingdom_id);
create index if not exists idx_quests_type_active  on public.quests(type) where is_active;

create index if not exists idx_uq_user             on public.user_quests(user_id);
create index if not exists idx_uq_quest            on public.user_quests(quest_id);
create index if not exists idx_uq_user_status      on public.user_quests(user_id, status);

create index if not exists idx_ua_user             on public.user_achievements(user_id);
create index if not exists idx_ua_achievement      on public.user_achievements(achievement_id);

create index if not exists idx_products_category   on public.products(category) where is_active;
create index if not exists idx_products_character  on public.products(character_id);

create index if not exists idx_orders_user         on public.orders(user_id);
create index if not exists idx_orders_status       on public.orders(status);

create index if not exists idx_order_items_order   on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);

create index if not exists idx_events_starts       on public.events(starts_at desc);
create index if not exists idx_events_status       on public.events(status);

create index if not exists idx_tickets_event       on public.tickets(event_id);
create index if not exists idx_tickets_user        on public.tickets(user_id);

-- ------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
--   ▸ 마스터 데이터: 누구나 SELECT, 쓰기는 service_role(관리자)만
--   ▸ 유저 소유 데이터: 본인(auth.uid())만 CRUD
-- ------------------------------------------------------------
alter table public.zodiacs            enable row level security;
alter table public.characters         enable row level security;
alter table public.kingdoms           enable row level security;
alter table public.quests             enable row level security;
alter table public.achievements       enable row level security;
alter table public.products           enable row level security;
alter table public.events             enable row level security;
alter table public.users              enable row level security;
alter table public.user_quests        enable row level security;
alter table public.user_achievements  enable row level security;
alter table public.orders             enable row level security;
alter table public.order_items        enable row level security;
alter table public.tickets            enable row level security;

-- 6.1 공개 읽기 (마스터 데이터)
create policy "read_zodiacs"      on public.zodiacs      for select using (true);
create policy "read_characters"   on public.characters   for select using (true);
create policy "read_kingdoms"     on public.kingdoms     for select using (true);
create policy "read_quests"       on public.quests       for select using (true);
create policy "read_achievements" on public.achievements for select using (true);
create policy "read_products"     on public.products     for select using (true);
create policy "read_events"       on public.events       for select using (true);

-- 6.2 users : 본인 행만
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

-- 6.3 user_quests : 본인 소유
create policy "uq_select_own" on public.user_quests for select using (auth.uid() = user_id);
create policy "uq_cud_own"    on public.user_quests for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6.4 user_achievements : 본인 소유
create policy "ua_select_own" on public.user_achievements for select using (auth.uid() = user_id);
create policy "ua_cud_own"    on public.user_achievements for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6.5 orders : 본인 소유
create policy "orders_cud_own" on public.orders for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6.6 order_items : 소속 주문의 소유자만
create policy "order_items_own" on public.order_items for all
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()))
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- 6.7 tickets : 본인 소유
create policy "tickets_cud_own" on public.tickets for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
--  END OF SCHEMA
-- ============================================================
