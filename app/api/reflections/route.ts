import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { date, type = "daily", went_well, blocked_by, learned, change_next, mood_score } =
      await request.json();

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Local tracking for unauthenticated users
      return NextResponse.json({ success: true, localOnly: true });
    }

    const reflectionDate = date || new Date().toISOString().split("T")[0];

    const { data, error } = await supabase.from("reflections").upsert(
      {
        user_id: user.id,
        date: reflectionDate,
        type,
        went_well: went_well || "",
        blocked_by: blocked_by || "",
        learned: learned || null,
        change_next: change_next || "",
        mood_score: mood_score || null,
      },
      { onConflict: "user_id,date,type" }
    );

    if (error) {
      console.warn("Supabase reflection upsert error:", error);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

