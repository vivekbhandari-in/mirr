"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Export all user data as structured JSON
 */
export async function exportUserData() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [profileRes, mirrorRes, habitsRes, checkinsRes, returnEventsRes, reflectionsRes] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("user_mirrors").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("checkins").select("*").eq("user_id", user.id),
        supabase.from("return_events").select("*").eq("user_id", user.id),
        supabase.from("reflections").select("*").eq("user_id", user.id),
      ]);

    const exportPayload = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        profile: profileRes.data,
      },
      mirror: mirrorRes.data,
      habits: habitsRes.data || [],
      checkins: checkinsRes.data || [],
      returnEvents: returnEventsRes.data || [],
      reflections: reflectionsRes.data || [],
    };

    return { success: true, data: exportPayload };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Export plaintext return journal
 */
export async function exportPlaintextJournal() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: checkins } = await supabase
      .from("checkins")
      .select("date, completed, note, missed_reason")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    let journal = `# Mirr Return Journal — ${user.email}\nGenerated on ${new Date().toLocaleDateString()}\n\n`;
    journal += `"You don't need a perfect streak. You need a way back."\n\n---\n\n`;

    (checkins || []).forEach((c) => {
      const status = c.completed ? "✓ Returned / Completed" : "· Missed";
      journal += `### ${c.date} — ${status}\n`;
      if (c.missed_reason) journal += `Reason: ${c.missed_reason}\n`;
      if (c.note) journal += `Note: ${c.note}\n`;
      journal += `\n`;
    });

    return { success: true, text: journal };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete account and all user-associated data
 */
export async function deleteAccount() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Delete profile (cascades to all user records)
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.auth.signOut();

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

