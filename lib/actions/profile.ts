"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  timezone: z.string().default("UTC"),
});

export async function updateProfile(input: z.infer<typeof profileSchema>) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid profile data" };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: parsed.data.fullName,
        timezone: parsed.data.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/profile");
    revalidatePath("/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

