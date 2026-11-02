import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateWeeklyNudges } from "@/lib/ai/nudges";
import { sendEmail } from "@/lib/resend";

export async function GET() {
  const authHeader = headers().get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    // Find active trial and pro users
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, timezone, plan")
      .in("plan", ["trial", "pro", "founding"]);

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: "No active users for digest", sent: 0 });
    }

    let sentCount = 0;

    for (const profile of profiles) {
      // Fetch user's auth email
      const {
        data: { user },
      } = await supabase.auth.admin.getUserById(profile.id);

      if (!user?.email) continue;

      // Fetch streak & survey
      const { data: streakRow } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", profile.id)
        .single();

      const { data: surveyRow } = await supabase
        .from("surveys")
        .select("area, future_vision, blocker")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const streak = streakRow?.current_streak || 1;
      const weekData = {
        checkins_count: 5,
        total_possible: 7,
        missed_reasons: ["Low energy"],
        streak,
      };

      const nudges = await generateWeeklyNudges(surveyRow || {}, weekData);

      const subject = `Your week in review — ${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mirr.app";

      const html = `
        <div style="background-color: #13110F; color: #F5F0E8; font-family: -apple-system, sans-serif; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #1A1613; border: 1px solid rgba(201,169,110,0.2); border-radius: 4px; padding: 32px 28px;">
            <p style="font-size: 20px; font-family: Georgia, serif; color: #F5F0E8; margin-bottom: 20px;">
              Mirr<span style="color: #C9A96E;">.</span>
            </p>
            <h1 style="font-size: 20px; font-family: Georgia, serif; color: #F5F0E8; font-weight: normal; margin-bottom: 14px;">
              Your week in review
            </h1>
            <p style="font-size: 14px; color: #9E958A; margin-bottom: 20px; line-height: 1.6;">
              You're on a <strong style="color: #F5F0E8;">${streak}-day streak</strong> in ${surveyRow?.area || "growth"}. Here are 3 quiet questions to sit with before the new week begins:
            </p>
            <ol style="color: #C9A96E; font-size: 13px; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
              ${nudges.map((n) => `<li style="margin-bottom: 8px;"><span style="color: #F5F0E8;">${n}</span></li>`).join("")}
            </ol>
            <p style="margin-bottom: 20px;">
              <a href="${appUrl}/dashboard" style="background-color: #C9A96E; color: #13110F; padding: 10px 20px; text-decoration: none; border-radius: 3px; font-size: 13px; font-weight: 500; display: inline-block;">
                Open growth dashboard
              </a>
            </p>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(201,169,110,0.15); font-size: 11px; color: #6B6259; text-align: center;">
              Mirr Weekly Digest · <a href="${appUrl}/settings" style="color: #6B6259;">Notification preferences</a>
            </div>
          </div>
        </div>
      `;

      const text = `Your week in review:\n\n${nudges.map((n, i) => `${i + 1}. ${n}`).join("\n\n")}\n\nOpen dashboard: ${appUrl}/dashboard`;

      await sendEmail({
        to: user.email,
        subject,
        html,
        text,
      });

      sentCount++;
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (error: any) {
    console.error("Weekly digest cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

