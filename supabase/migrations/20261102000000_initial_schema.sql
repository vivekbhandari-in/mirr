-- ====================================================================
-- MIRR PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- Zero-cost infrastructure (Supabase PostgreSQL + Row Level Security)
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS & TYPES
do $$ begin
  create type user_plan as enum ('free', 'trial', 'pro', 'founding');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type reflection_type as enum ('daily', 'weekly');
exception
  when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text,
  avatar_url text,
  timezone text default 'UTC',
  plan user_plan not null default 'trial',
  trial_started_at timestamptz default now(),
  trial_ends_at timestamptz default (now() + interval '30 days'),
  stripe_customer_id text,
  stripe_subscription_id text,
  onboarded_at timestamptz,
  last_active_at timestamptz default now(),
  referred_by uuid references public.profiles(id) on delete set null,
  referral_code text unique not null default substring(md5(random()::text) from 1 for 8),
  referral_credits_days int not null default 0
);

-- 4. SURVEYS TABLE
create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  area text not null,
  problem text not null,
  future_vision text not null,
  blocker text not null,
  routine text not null,
  time_available text not null,
  raw_answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. PLANS TABLE
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  survey_id uuid references public.surveys(id) on delete set null,
  mirror_summary jsonb not null default '{}'::jsonb,
  insight_headline text not null,
  insight_body text not null,
  insight_steps jsonb not null default '[]'::jsonb,
  nudge_questions jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  model_version text not null default 'claude-sonnet-4-6',
  regeneration_count int not null default 0
);

-- 6. HABITS TABLE
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  name text not null,
  purpose text not null,
  action text not null,
  cue text not null,
  minimum_version text not null,
  frequency text not null default 'Daily',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

-- 7. CHECKINS TABLE
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null default current_date,
  completed boolean not null default true,
  missed_reason text,
  note text,
  created_at timestamptz not null default now(),
  constraint checkins_user_habit_date_unique unique (user_id, habit_id, date)
);

-- 8. REFLECTIONS TABLE
create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  type reflection_type not null default 'daily',
  went_well text not null,
  blocked_by text not null,
  learned text,
  change_next text not null,
  mood_score int check (mood_score >= 1 and mood_score <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reflections_user_date_type_unique unique (user_id, date, type)
);

-- 9. STREAKS TABLE
create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  current_streak int not null default 1,
  longest_streak int not null default 1,
  last_active_date date not null default current_date,
  total_active_days int not null default 1,
  updated_at timestamptz not null default now()
);

-- 10. PUBLIC MIRRORS TABLE (Viral acquisition mechanic)
create table if not exists public.public_mirrors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text unique not null,
  area text not null,
  problem_summary text not null,
  future_summary text not null,
  blocker_summary text not null,
  habits_count int not null default 3,
  is_active boolean not null default true,
  view_count int not null default 0,
  created_at timestamptz not null default now()
);

-- 11. REFERRALS TABLE
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null unique references public.profiles(id) on delete cascade,
  code text not null,
  converted_at timestamptz,
  credit_applied boolean not null default false,
  created_at timestamptz not null default now()
);

-- 12. FOUNDING MEMBERS TABLE
create table if not exists public.founding_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  order_number serial not null,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

-- 13. LAUNCH SUBSCRIBERS TABLE
create table if not exists public.launch_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'website',
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

-- 14. WALL ENTRIES TABLE
create table if not exists public.wall_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  public_mirror_id uuid not null references public.public_mirrors(id) on delete cascade,
  is_featured boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

-- 15. USAGE LOGS TABLE (Cost controls & daily rate limiting)
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  tokens_used int default 0,
  created_at timestamptz not null default now()
);

-- ====================================================================
-- INDEXES
-- ====================================================================
create index if not exists idx_checkins_user_date on public.checkins(user_id, date);
create index if not exists idx_reflections_user_date on public.reflections(user_id, date);
create index if not exists idx_public_mirrors_slug on public.public_mirrors(slug);
create index if not exists idx_referrals_code on public.referrals(code);
create index if not exists idx_launch_subscribers_email on public.launch_subscribers(email);
create index if not exists idx_usage_logs_user_date on public.usage_logs(user_id, created_at);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.surveys enable row level security;
alter table public.plans enable row level security;
alter table public.habits enable row level security;
alter table public.checkins enable row level security;
alter table public.reflections enable row level security;
alter table public.streaks enable row level security;
alter table public.public_mirrors enable row level security;
alter table public.referrals enable row level security;
alter table public.founding_members enable row level security;
alter table public.launch_subscribers enable row level security;
alter table public.wall_entries enable row level security;
alter table public.usage_logs enable row level security;

-- PROFILES POLICIES
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SURVEYS POLICIES
create policy "Users can view their own surveys"
  on public.surveys for select
  using (auth.uid() = user_id);

create policy "Users can insert their own survey"
  on public.surveys for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own survey"
  on public.surveys for update
  using (auth.uid() = user_id);

-- PLANS POLICIES
create policy "Users can view their own plans"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plan"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own plan"
  on public.plans for update
  using (auth.uid() = user_id);

-- HABITS POLICIES
create policy "Users can view their own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Users can delete their own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- CHECKINS POLICIES
create policy "Users can view their own checkins"
  on public.checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own checkins"
  on public.checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own checkins"
  on public.checkins for update
  using (auth.uid() = user_id);

create policy "Users can delete their own checkins"
  on public.checkins for delete
  using (auth.uid() = user_id);

-- REFLECTIONS POLICIES
create policy "Users can view their own reflections"
  on public.reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reflections"
  on public.reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reflections"
  on public.reflections for update
  using (auth.uid() = user_id);

-- STREAKS POLICIES
create policy "Users can view their own streak"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own streak"
  on public.streaks for all
  using (auth.uid() = user_id);

-- PUBLIC MIRRORS POLICIES
create policy "Public mirrors are viewable by anyone if active"
  on public.public_mirrors for select
  using (is_active = true);

create policy "Users can manage their own public mirror"
  on public.public_mirrors for all
  using (auth.uid() = user_id);

-- REFERRALS POLICIES
create policy "Users can view their referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

create policy "Users can insert referrals"
  on public.referrals for insert
  with check (auth.uid() = referred_id);

-- FOUNDING MEMBERS POLICIES
create policy "Anyone can count founding members"
  on public.founding_members for select
  using (true);

-- LAUNCH SUBSCRIBERS POLICIES
create policy "Anyone can subscribe to launch"
  on public.launch_subscribers for insert
  with check (true);

-- WALL ENTRIES POLICIES
create policy "Wall entries are viewable by anyone if approved"
  on public.wall_entries for select
  using (approved_at is not null);

create policy "Users can submit wall entries"
  on public.wall_entries for insert
  with check (auth.uid() = user_id);

-- USAGE LOGS POLICIES
create policy "Users can view their usage"
  on public.usage_logs for select
  using (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ====================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    name,
    avatar_url,
    plan,
    trial_started_at,
    trial_ends_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'trial',
    now(),
    now() + interval '30 days'
  );

  insert into public.streaks (user_id, current_streak, longest_streak, last_active_date, total_active_days)
  values (new.id, 1, 1, current_date, 1);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

