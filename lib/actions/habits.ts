"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const createHabitSchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["habit", "project", "study", "fitness", "routine", "other"]).default("habit"),
  fullAction: z.string().min(2, "Action is required"),
  minimumAction: z.string().min(2, "Minimum version is required"),
  anchor: z.string().optional(),
  defaultMinutes: z.number().min(2).max(120).default(10),
});

/**
 * Create or stack a new habit (max 3 active)
 */
export async function createHabit(input: z.infer<typeof createHabitSchema>) {
  const parsed = createHabitSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check existing active habits count (max 3)
    const { count, error: countError } = await supabase
      .from("habits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (count !== null && count >= 3) {
      return {
        success: false,
        error: "Mirr focuses on consistency: maximum 3 active habits allowed. Please pause or archive an existing habit to add a new one.",
      };
    }

    // Insert into habits table
    const { data: newHabit, error: insertError } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        name: parsed.data.title,
        action: parsed.data.fullAction,
        purpose: parsed.data.title,
        cue: parsed.data.anchor || "Daily ritual",
        minimum_version: parsed.data.minimumAction,
        frequency: "Daily",
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Also mirror to tracks table if present
    await supabase.from("tracks").insert({
      user_id: user.id,
      title: parsed.data.title,
      type: parsed.data.type,
      full_action: parsed.data.fullAction,
      minimum_action: parsed.data.minimumAction,
      anchor: parsed.data.anchor,
      default_minutes: parsed.data.defaultMinutes,
      status: "active",
      maturity: "seed",
    });

    revalidatePath("/dashboard");
    revalidatePath("/settings");
    return { success: true, data: newHabit };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Pause or toggle habit active state
 */
export async function toggleHabitStatus(habitId: string, isActive: boolean) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("habits")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", habitId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Archive a habit
 */
export async function archiveHabit(habitId: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("habits")
      .update({
        is_active: false,
        archived_at: new Date().toISOString(),
      })
      .eq("id", habitId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

