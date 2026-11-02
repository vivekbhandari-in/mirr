import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { habit_id, date, completed, missed_reason, note } = await request.json();

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Unauthenticated users track locally in localStorage
      return NextResponse.json({ success: true, localOnly: true });
    }

    const todayDate = date || new Date().toISOString().split("T")[0];

    const { data, error } = await supabase.from("checkins").upsert(
      {
        user_id: user.id,
        habit_id,
        date: todayDate,
        completed: !!completed,
        missed_reason: missed_reason || null,
        note: note || null,
      },
      { onConflict: "user_id,habit_id,date" }
    );

    if (error) {
      console.warn("Supabase checkin error:", error);
    }

    // Update streak if completed
    if (completed) {
      const { data: streakRow } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (streakRow) {
        const lastActive = streakRow.last_active_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        let newStreak = streakRow.current_streak;
        if (lastActive === yesterday) {
          newStreak += 1;
        } else if (lastActive !== todayDate) {
          newStreak = 1;
        }

        const longest = Math.max(newStreak, streakRow.longest_streak);

        await supabase
          .from("streaks")
          .update({
            current_streak: newStreak,
            longest_streak: longest,
            last_active_date: todayDate,
            total_active_days: streakRow.total_active_days + (lastActive !== todayDate ? 1 : 0),
          })
          .eq("user_id", user.id);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

