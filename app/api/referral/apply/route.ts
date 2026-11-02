import { NextResponse } from "next/server";
import { recordReferral } from "@/lib/growth/referral";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await recordReferral(code, user.id);
    return NextResponse.json({ success: true, res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

