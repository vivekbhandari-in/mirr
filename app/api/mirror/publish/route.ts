import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const {
      area = "Personal growth",
      problem_summary = "",
      future_summary = "",
      blocker_summary = "",
      habits_count = 3,
    } = await request.json();

    const slug = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("public_mirrors").insert({
        user_id: user.id,
        slug,
        area,
        problem_summary,
        future_summary,
        blocker_summary,
        habits_count,
        is_active: true,
      });
    }

    return NextResponse.json({ success: true, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

