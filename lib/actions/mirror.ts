"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const updateMirrorSchema = z.object({
  desiredIdentity: z.string().min(2),
  currentReality: z.string().optional(),
  mainBlocker: z.string().min(2),
  antiFuture: z.string().optional(),
  dailyProtectedTime: z.number().min(2).max(120).default(10),
  focusArea: z.string().default("project"),
});

/**
 * Edit Mirror settings
 */
export async function updateMirror(input: z.infer<typeof updateMirrorSchema>) {
  const parsed = updateMirrorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid mirror parameters" };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. Update user_mirrors table
    await supabase.from("user_mirrors").upsert(
      {
        user_id: user.id,
        desired_identity: parsed.data.desiredIdentity,
        current_reality: parsed.data.currentReality || "",
        main_blocker: parsed.data.mainBlocker,
        anti_future: parsed.data.antiFuture || "",
        daily_minutes: parsed.data.dailyProtectedTime,
        focus_area: parsed.data.focusArea,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    // 2. Compatibility update on plans table
    const { data: existingPlan } = await supabase
      .from("plans")
      .select("id, mirror_summary")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (existingPlan) {
      const updatedSummary = {
        ...(existingPlan.mirror_summary || {}),
        desiredIdentity: parsed.data.desiredIdentity,
        mainBlocker: parsed.data.mainBlocker,
        dailyProtectedTime: parsed.data.dailyProtectedTime,
        antiFuture: parsed.data.antiFuture,
        focusArea: parsed.data.focusArea,
      };

      await supabase
        .from("plans")
        .update({ mirror_summary: updatedSummary })
        .eq("id", existingPlan.id);
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath("/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Progressively set identity after first completed restart
 */
export async function saveIdentityDiscovery(identity: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await supabase.from("user_mirrors").upsert(
      {
        user_id: user.id,
        desired_identity: identity,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

