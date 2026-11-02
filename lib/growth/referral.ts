import { createAdminClient } from "@/lib/supabase/admin";

export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getReferralUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mirr.app";
  return `${baseUrl}/signup?ref=${code}`;
}

export async function recordReferral(referrerCode: string, referredUserId: string) {
  const supabase = createAdminClient();

  // Find referrer
  const { data: referrer } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", referrerCode)
    .single();

  if (!referrer) return null;

  // Insert referral record
  const { data } = await supabase.from("referrals").insert({
    referrer_id: referrer.id,
    referred_id: referredUserId,
    code: referrerCode,
    credit_applied: false,
  });

  // Link profile
  await supabase
    .from("profiles")
    .update({ referred_by: referrer.id })
    .eq("id", referredUserId);

  return data;
}

