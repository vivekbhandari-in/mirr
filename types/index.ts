export type PlanType = 'free' | 'trial' | 'pro' | 'founding';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  avatar_url: string | null;
  timezone: string;
  plan: PlanType;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  onboarded_at: string | null;
  last_active_at: string | null;
  referred_by: string | null;
  referral_code: string;
  referral_credits_days: number;
}

export interface Survey {
  id: string;
  user_id: string;
  area: string;
  problem: string;
  future_vision: string;
  blocker: string;
  routine: string;
  time_available: string;
  raw_answers: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PlanInsight {
  headline: string;
  body: string;
  steps: string[];
  nudges: string[];
  pattern_detected?: string;
  confidence_notes?: string;
}

export interface Plan {
  id: string;
  user_id: string;
  survey_id: string;
  mirror_summary: {
    area: string;
    problem: string;
    future: string;
    blocker: string;
  };
  insight_headline: string;
  insight_body: string;
  insight_steps: string[];
  nudge_questions: string[];
  generated_at: string;
  model_version: string;
  regeneration_count: number;
}

export interface Habit {
  id: string;
  user_id: string;
  plan_id?: string | null;
  name: string;
  purpose: string;
  action: string;
  cue: string;
  minimum_version: string;
  frequency: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
  // Local/UI helper property
  done?: boolean;
}

export interface Checkin {
  id: string;
  user_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  missed_reason?: string | null;
  note?: string | null;
  created_at: string;
}

export interface Reflection {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  type: 'daily' | 'weekly';
  went_well: string;
  blocked_by: string;
  learned?: string | null;
  change_next: string;
  mood_score?: number | null; // 1-5
  created_at: string;
  updated_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  total_active_days: number;
  updated_at: string;
}

export interface PublicMirror {
  id: string;
  user_id: string;
  slug: string;
  area: string;
  problem_summary: string;
  future_summary: string;
  blocker_summary: string;
  habits_count: number;
  is_active: boolean;
  view_count: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  code: string;
  converted_at?: string | null;
  credit_applied: boolean;
  created_at: string;
}

export interface FoundingMember {
  id: string;
  user_id: string;
  order_number: number;
  stripe_payment_intent_id: string;
  created_at: string;
}

export interface LaunchSubscriber {
  id: string;
  email: string;
  source: string;
  notified_at?: string | null;
  created_at: string;
}

export interface WallEntry {
  id: string;
  user_id: string;
  public_mirror_id: string;
  is_featured: boolean;
  approved_at?: string | null;
  created_at: string;
}

