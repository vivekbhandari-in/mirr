import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("founding_members")
      .select("*", { count: "exact", head: true });

    if (error) {
      // Default to 14 if table empty or unconfigured
      return NextResponse.json({ count: 14 });
    }

    return NextResponse.json({ count: Math.max(14, count || 0) });
  } catch {
    return NextResponse.json({ count: 14 });
  }
}

