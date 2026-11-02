import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMirrorInsights } from "@/lib/ai/insights";
import { generatePersonalizedHabits } from "@/lib/ai/habits";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      area = "Career & work",
      problem = "Feeling stuck",
      future_vision = "Building something meaningful",
      blocker = "Fear of failure",
      routine = "Unstructured days",
      time_available = "20 minutes",
    } = body;

    const surveyData = {
      area,
      problem,
      future_vision,
      blocker,
      routine,
      time_available,
    };

    // 1. Generate Insights and Habits via AI (or resilient fallback)
    const insights = await generateMirrorInsights(surveyData);
    const habits = await generatePersonalizedHabits(surveyData, insights);

    // 2. Check if user is logged into Supabase
    let userId: string | null = null;
    let planId: string | null = null;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;

        // Check rate limiting on usage_logs (max 10 AI calls per day)
        const todayStr = new Date().toISOString().split("T")[0];
        const { count } = await supabase
          .from("usage_logs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", `${todayStr}T00:00:00Z`);

        if ((count || 0) >= 10) {
          return NextResponse.json(
            { error: "Daily limit reached for AI generation. Please try again tomorrow." },
            { status: 429 }
          );
        }

        // Insert survey
        const { data: surveyRow, error: surveyErr } = await supabase
          .from("surveys")
          .insert({
            user_id: user.id,
            area,
            problem,
            future_vision,
            blocker,
            routine,
            time_available,
            raw_answers: body,
          })
          .select("id")
          .single();

        const surveyId = surveyRow?.id;

        // Insert plan
        const { data: planRow } = await supabase
          .from("plans")
          .insert({
            user_id: user.id,
            survey_id: surveyId,
            mirror_summary: {
              area,
              problem,
              future: future_vision,
              blocker,
            },
            insight_headline: insights.headline,
            insight_body: insights.body,
            insight_steps: insights.steps,
            nudge_questions: insights.nudges,
          })
          .select("id")
          .single();

        planId = planRow?.id || null;

        // Insert habits
        if (habits && habits.length > 0) {
          const habitRows = habits.map((h, index) => ({
            user_id: user.id,
            plan_id: planId,
            name: h.name,
            purpose: h.purpose,
            action: h.action,
            cue: h.cue,
            minimum_version: h.minimum_version,
            frequency: h.frequency,
            sort_order: index,
            is_active: true,
          }));

          await supabase.from("habits").insert(habitRows);
        }

        // Log AI usage
        await supabase.from("usage_logs").insert({
          user_id: user.id,
          action: "survey_complete_generation",
          tokens_used: 1200,
        });

        // Mark profile onboarded
        await supabase
          .from("profiles")
          .update({ onboarded_at: new Date().toISOString() })
          .eq("id", user.id);
      }
    } catch (dbErr) {
      console.warn("Could not save to Supabase (continuing client-side):", dbErr);
    }

    return NextResponse.json({
      success: true,
      planId,
      insights,
      habits,
    });
  } catch (error: any) {
    console.error("Survey complete route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process survey" },
      { status: 500 }
    );
  }
}

