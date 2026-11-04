import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      if (process.env.NODE_ENV === "production") {
        console.error("Strict webhook signature verification failed: Missing secret or signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (userId && userId !== "guest") {
          if (tier === "founding") {
            // Upgrade to founding
            await supabase
              .from("profiles")
              .update({ plan: "founding" })
              .eq("id", userId);

            // Record founding member
            await supabase.from("founding_members").insert({
              user_id: userId,
              stripe_payment_intent_id: session.payment_intent || session.id,
            });
          } else {
            // Pro subscription
            await supabase
              .from("profiles")
              .update({
                plan: "pro",
                stripe_subscription_id: session.subscription,
              })
              .eq("id", userId);
          }

          // Check if user was referred by someone — credit the referrer 30 days!
          const { data: referral } = await supabase
            .from("referrals")
            .select("*")
            .eq("referred_id", userId)
            .eq("credit_applied", false)
            .single();

          if (referral) {
            // Apply 30 free days credit to referrer
            const { data: referrerProfile } = await supabase
              .from("profiles")
              .select("referral_credits_days, trial_ends_at")
              .eq("id", referral.referrer_id)
              .single();

            if (referrerProfile) {
              const currentCredits = referrerProfile.referral_credits_days || 0;
              await supabase
                .from("profiles")
                .update({
                  referral_credits_days: currentCredits + 30,
                })
                .eq("id", referral.referrer_id);

              await supabase
                .from("referrals")
                .update({
                  credit_applied: true,
                  converted_at: new Date().toISOString(),
                })
                .eq("id", referral.id);
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await supabase
          .from("profiles")
          .update({ plan: "free", stripe_subscription_id: null })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

