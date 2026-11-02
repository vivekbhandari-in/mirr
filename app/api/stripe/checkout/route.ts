import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { tier = "pro_monthly" } = await request.json();

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. Get user profile if logged in
    let customerId: string | undefined = undefined;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id;
      } else if (user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { supabase_uid: user.id },
        });
        customerId = customer.id;
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }
    }

    // Determine price or line items
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let mode: Stripe.Checkout.SessionCreateParams.Mode = "subscription";

    if (tier === "founding") {
      mode = "payment";
      const foundingPriceId = process.env.STRIPE_FOUNDING_PRICE_ID;
      if (foundingPriceId) {
        lineItems = [{ price: foundingPriceId, quantity: 1 }];
      } else {
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Mirr Founding Member — Lifetime Access",
                description: "Lifetime access to Pro, Founding wall badge, and direct line to founder.",
              },
              unit_amount: 4900, // $49.00
            },
            quantity: 1,
          },
        ];
      }
    } else if (tier === "pro_yearly") {
      mode = "subscription";
      const yearlyPriceId = process.env.STRIPE_PRO_YEARLY_PRICE_ID;
      if (yearlyPriceId) {
        lineItems = [{ price: yearlyPriceId, quantity: 1 }];
      } else {
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Mirr Pro (Annual)",
                description: "Unlimited habits, AI digests, heatmap history, and weekly review.",
              },
              unit_amount: 4900, // $49.00/yr
              recurring: { interval: "year" },
            },
            quantity: 1,
          },
        ];
      }
    } else {
      // pro_monthly default
      mode = "subscription";
      const monthlyPriceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
      if (monthlyPriceId) {
        lineItems = [{ price: monthlyPriceId, quantity: 1 }];
      } else {
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Mirr Pro (Monthly)",
                description: "Unlimited habits, AI digests, heatmap history, and weekly review.",
              },
              unit_amount: 700, // $7.00/mo
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ];
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user?.email,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: mode,
      success_url: `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId: user?.id || "guest",
        tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate Stripe checkout" },
      { status: 500 }
    );
  }
}
