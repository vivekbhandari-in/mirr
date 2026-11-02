import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { email, source = "producthunt" } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("launch_subscribers").upsert(
      {
        email: email.trim().toLowerCase(),
        source,
      },
      { onConflict: "email" }
    );

    if (error) {
      console.warn("Supabase launch subscribe warning:", error);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

