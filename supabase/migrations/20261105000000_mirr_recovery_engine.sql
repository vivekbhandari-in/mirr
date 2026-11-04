-- ====================================================================
-- MIRR RECOVERY ENGINE SCHEMA & RLS POLICIES (MIGRATION 20261105000000)
-- Full support for recovery-first habits, tracks, return events & weekly reviews
-- ====================================================================

-- 1. TRACKS TABLE (Habit / Project / Routine tracks)
create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type text not null default 'habit' check (type in ('habit', 'project', 'study', 'fitness', 'routine', 'other')),
  full_action text not null,
  minimum_action text not null,
  anchor text,
  default_minutes int not null default 10,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  maturity text not null default 'seed' check (maturity in ('seed', 'rhythm', 'automatic', 'stacked')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. DAILY ACTIONS TABLE (One primary action per user per day)
create table if not exists public.daily_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete set null,
  date date not null default current_date,
  action_text text not null,
  minimum_action_text text not null,
  planned_minutes int not null default 10,
  status text not null default 'pending' check (status in ('pending', 'completed', 'minimum_completed', 'missed', 'skipped')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_actions_user_date_unique unique (user_id, date)
);

-- 3. RETURN EVENTS TABLE (Logs returns after drift & completion events)
create table if not exists public.return_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  daily_action_id uuid references public.daily_actions(id) on delete set null,
  event_type text not null check (event_type in ('return', 'full_completion', 'minimum_completion', 'missed', 'skipped')),
  missed_reason text,
  minutes_spent int default 0,
  notes text,
  created_at timestamptz not null default now()
);

-- 4. WEEKLY REVIEWS TABLE (Sunday reviews & actionable experiments)
create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start_date date not null,
  return_count int not null default 0,
  average_minutes int not null default 0,
  main_friction text,
  insight text not null,
  next_experiment text not null,
  created_at timestamptz not null default now(),
  constraint weekly_reviews_user_week_unique unique (user_id, week_start_date)
);

-- 5. USER MIRRORS TABLE (Identity contract & focus configuration)
create table if not exists public.user_mirrors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  focus_area text not null default 'project' check (focus_area in ('project', 'habit', 'study', 'fitness', 'routine', 'other')),
  main_blocker text not null default 'distraction',
  daily_minutes int not null default 10 check (daily_minutes in (2, 5, 10, 25)),
  desired_identity text,
  anti_future text,
  current_reality text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
create index if not exists idx_tracks_user_status on public.tracks(user_id, status);
create index if not exists idx_daily_actions_user_date on public.daily_actions(user_id, date);
create index if not exists idx_return_events_user_created on public.return_events(user_id, created_at);
create index if not exists idx_weekly_reviews_user_week on public.weekly_reviews(user_id, week_start_date);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================================================
alter table public.tracks enable row level security;
alter table public.daily_actions enable row level security;
alter table public.return_events enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.user_mirrors enable row level security;

-- TRACKS POLICIES
create policy "Users can view their own tracks"
  on public.tracks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tracks"
  on public.tracks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tracks"
  on public.tracks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tracks"
  on public.tracks for delete
  using (auth.uid() = user_id);

-- DAILY ACTIONS POLICIES
create policy "Users can view their own daily actions"
  on public.daily_actions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own daily actions"
  on public.daily_actions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own daily actions"
  on public.daily_actions for update
  using (auth.uid() = user_id);

-- RETURN EVENTS POLICIES
create policy "Users can view their own return events"
  on public.return_events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own return events"
  on public.return_events for insert
  with check (auth.uid() = user_id);

-- WEEKLY REVIEWS POLICIES
create policy "Users can view their own weekly reviews"
  on public.weekly_reviews for select
  using (auth.uid() = user_id);

create policy "Users can insert their own weekly reviews"
  on public.weekly_reviews for insert
  with check (auth.uid() = user_id);

-- USER MIRRORS POLICIES
create policy "Users can view their own mirror"
  on public.user_mirrors for select
  using (auth.uid() = user_id);

create policy "Users can insert their own mirror"
  on public.user_mirrors for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own mirror"
  on public.user_mirrors for update
  using (auth.uid() = user_id);

