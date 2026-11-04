"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const completeRestartSchema = z.object({
  actionId: z.string().optional(),
  minutesSpent: z.number().min(1).max(180).default(5),
  notes: z.string().optional(),
});

const markMissedSchema = z.object({
  actionId: z.string().optional(),
  reason: z.string().min(1),
  notes: z.string().optional(),
});

/**
 * Complete today's full restart action
 */
export async function completeRestart(input: z.infer<typeof completeRestartSchema>) {
  const parsed = completeRestartSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid action data" };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    // 1. Update or insert daily action
    const { data: dailyAction, error: actionError } = await supabase
      .from("daily_actions")
      .upsert(
        {
          user_id: user.id,
          date: todayStr,
          status: "completed",
          completed_at: new Date().toISOString(),
          planned_minutes: parsed.data.minutesSpent,
          action_text: "Completed focused restart",
          minimum_action_text: "Completed minimum action",
        },
        { onConflict: "user_id,date" }
      )
      .select()
      .single();

    if (actionError) {
      console.warn("daily_actions update error, falling back to checkins:", actionError.message);
    }

    // 2. Insert return event
    await supabase.from("return_events").insert({
      user_id: user.id,
      daily_action_id: dailyAction?.id,
      event_type: "full_completion",
      minutes_spent: parsed.data.minutesSpent,
      notes: parsed.data.notes,
    });

    // 3. Fallback compatibility with checkins table
    const { data: activeHabit } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (activeHabit) {
      await supabase.from("checkins").upsert(
        {
          user_id: user.id,
          habit_id: activeHabit.id,
          date: todayStr,
          completed: true,
          note: parsed.data.notes || "Completed restart",
        },
        { onConflict: "user_id,habit_id,date" }
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/history");
    return { success: true, date: todayStr };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Complete today's 2-minute minimum version
 */
export async function completeMinimumVersion(input: {
  actionId?: string;
  notes?: string;
}) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    const { data: dailyAction } = await supabase
      .from("daily_actions")
      .upsert(
        {
          user_id: user.id,
          date: todayStr,
          status: "minimum_completed",
          completed_at: new Date().toISOString(),
          planned_minutes: 2,
          action_text: "Completed 2-minute minimum restart",
          minimum_action_text: "Completed minimum action",
        },
        { onConflict: "user_id,date" }
      )
      .select()
      .single();

    await supabase.from("return_events").insert({
      user_id: user.id,
      daily_action_id: dailyAction?.id,
      event_type: "minimum_completion",
      minutes_spent: 2,
      notes: input.notes,
    });

    revalidatePath("/dashboard");
    revalidatePath("/history");
    return { success: true, date: todayStr };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Mark today as missed with a friction reason (no guilt, sets up restart engine)
 */
export async function markMissed(input: z.infer<typeof markMissedSchema>) {
  const parsed = markMissedSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid reason" };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    const { data: dailyAction } = await supabase
      .from("daily_actions")
      .upsert(
        {
          user_id: user.id,
          date: todayStr,
          status: "missed",
          action_text: "Missed scheduled restart",
          minimum_action_text: "Minimum version",
        },
        { onConflict: "user_id,date" }
      )
      .select()
      .single();

    await supabase.from("return_events").insert({
      user_id: user.id,
      daily_action_id: dailyAction?.id,
      event_type: "missed",
      missed_reason: parsed.data.reason,
      notes: parsed.data.notes,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Skip today intentionally
 */
export async function skipToday(input: { note?: string }) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    await supabase.from("daily_actions").upsert(
      {
        user_id: user.id,
        date: todayStr,
        status: "skipped",
        action_text: "Rest day / Skipped",
        minimum_action_text: "Skipped",
      },
      { onConflict: "user_id,date" }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

