import { sendEmail } from "../index";

const emailBaseStyle = `
  background-color: #13110F;
  color: #F5F0E8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 40px 20px;
  line-height: 1.6;
`;

const emailCardStyle = `
  max-width: 520px;
  margin: 0 auto;
  background-color: #1A1613;
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 4px;
  padding: 32px 28px;
`;

const emailFooterStyle = `
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(201, 169, 110, 0.15);
  font-size: 11px;
  color: #6B6259;
  text-align: center;
`;

export async function sendWelcomeEmail(to: string, name: string) {
  const subject = `Your mirror is ready, ${name || "friend"}.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mirr.app";

  const html = `
    <div style="${emailBaseStyle}">
      <div style="${emailCardStyle}">
        <p style="font-size: 20px; font-family: Georgia, serif; color: #F5F0E8; margin-bottom: 20px;">
          Mirr<span style="color: #C9A96E;">.</span>
        </p>
        <h1 style="font-size: 22px; font-family: Georgia, serif; color: #F5F0E8; font-weight: normal; margin-bottom: 16px;">
          Become who you said you'd be.
        </h1>
        <p style="font-size: 14px; color: #9E958A; margin-bottom: 24px; line-height: 1.7;">
          Welcome to Mirr. Most habit trackers give you a blank checklist and expect willpower. Mirr starts with honesty: articulating what's really holding you back and calibrating atomic actions you can actually keep.
        </p>
        <p style="margin-bottom: 28px;">
          <a href="${appUrl}/survey" style="background-color: #C9A96E; color: #13110F; padding: 12px 24px; text-decoration: none; border-radius: 3px; font-weight: 500; font-size: 13px; display: inline-block;">
            Complete your mirror survey
          </a>
        </p>
        <p style="font-size: 12px; color: #6B6259;">
          Take two quiet minutes. No card needed.
        </p>
        <div style="${emailFooterStyle}">
          Mirr · Private personal transformation<br/>
          <a href="${appUrl}/settings" style="color: #6B6259; text-decoration: underline;">Unsubscribe</a>
        </div>
      </div>
    </div>
  `;

  const text = `Welcome to Mirr, ${name || "friend"}.\n\nBecome who you said you'd be.\n\nTake two minutes to build your personal mirror:\n${appUrl}/survey\n\nNo card required.`;

  return sendEmail({ to, subject, html, text });
}

export async function sendTrialEndingEmail(
  to: string,
  streak: number,
  completedCheckins: number
) {
  const subject = `5 days left — your streak is ${streak}.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mirr.app";

  const html = `
    <div style="${emailBaseStyle}">
      <div style="${emailCardStyle}">
        <p style="font-size: 20px; font-family: Georgia, serif; color: #F5F0E8; margin-bottom: 20px;">
          Mirr<span style="color: #C9A96E;">.</span>
        </p>
        <h1 style="font-size: 20px; font-family: Georgia, serif; color: #F5F0E8; font-weight: normal; margin-bottom: 14px;">
          You've checked in ${completedCheckins} times.
        </h1>
        <p style="font-size: 14px; color: #9E958A; margin-bottom: 20px; line-height: 1.7;">
          Your current streak is <strong style="color: #F5F0E8;">${streak} days</strong>. That isn't luck — you showed up for yourself. Your 30-day all-access trial ends in 5 days.
        </p>
        <p style="font-size: 14px; color: #9E958A; margin-bottom: 24px; line-height: 1.7;">
          If you choose not to upgrade, you keep your core mirror, top 3 habits, and all data forever. If you want unlimited habits, weekly AI reviews, and full calendar heatmaps, join Pro.
        </p>
        <p style="margin-bottom: 24px;">
          <a href="${appUrl}/pricing" style="background-color: #C9A96E; color: #13110F; padding: 12px 24px; text-decoration: none; border-radius: 3px; font-weight: 500; font-size: 13px; display: inline-block;">
            Keep what you've built — $7/mo
          </a>
        </p>
        <div style="${emailFooterStyle}">
          Sent once on Day 25. We never spam.<br/>
          <a href="${appUrl}/settings" style="color: #6B6259; text-decoration: underline;">Manage notifications</a>
        </div>
      </div>
    </div>
  `;

  const text = `Your free trial ends in 5 days.\n\nYou have checked in ${completedCheckins} times with a ${streak}-day streak.\n\nKeep what you've built:\n${appUrl}/pricing`;

  return sendEmail({ to, subject, html, text });
}

export async function sendReferralCreditedEmail(
  to: string,
  referredName: string
) {
  const subject = `${referredName || "A friend"} just joined Mirr.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mirr.app";

  const html = `
    <div style="${emailBaseStyle}">
      <div style="${emailCardStyle}">
        <p style="font-size: 20px; font-family: Georgia, serif; color: #F5F0E8; margin-bottom: 20px;">
          Mirr<span style="color: #C9A96E;">.</span>
        </p>
        <h1 style="font-size: 20px; font-family: Georgia, serif; color: #F5F0E8; font-weight: normal; margin-bottom: 14px;">
          30 free days credited.
        </h1>
        <p style="font-size: 14px; color: #9E958A; margin-bottom: 24px; line-height: 1.7;">
          ${referredName || "Your friend"} just activated Mirr. We've credited 30 additional free days to your account. Thank you for spreading clarity.
        </p>
        <p style="margin-bottom: 24px;">
          <a href="${appUrl}/dashboard" style="background-color: #C9A96E; color: #13110F; padding: 12px 24px; text-decoration: none; border-radius: 3px; font-weight: 500; font-size: 13px; display: inline-block;">
            Go to your dashboard
          </a>
        </p>
        <div style="${emailFooterStyle}">
          Mirr Referral Program<br/>
          <a href="${appUrl}/refer" style="color: #6B6259; text-decoration: underline;">Your referral link</a>
        </div>
      </div>
    </div>
  `;

  const text = `${referredName || "Your friend"} just joined Mirr. You both get 30 free days. Thanks for spreading the word!\n\n${appUrl}/dashboard`;

  return sendEmail({ to, subject, html, text });
}

