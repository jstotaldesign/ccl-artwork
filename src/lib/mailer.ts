/**
 * Email sender (Resend). Logs every send into EmailLog so buyers can build
 * a "delivery status" UI.
 *
 * In dev (no RESEND_API_KEY) emails are logged to stdout and the DB.
 */

import { prisma } from "./prisma";

interface SendOpts {
  to: string;
  subject: string;
  html: string;
  text?: string;
  template?: string;
  tenantId?: string | null;
}

interface ResendResponse {
  id?: string;
  message?: string;
}

export async function sendEmail({ to, subject, html, text, template, tenantId }: SendOpts): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "noreply@example.com";

  if (!apiKey) {
    console.log(`[mailer] DEV mode → ${to} :: ${subject}`);
    await logEmail({ to, subject, template, tenantId, status: "sent", providerId: "dev-noop" });
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    const data: ResendResponse = await res.json();
    if (!res.ok) {
      await logEmail({ to, subject, template, tenantId, status: "failed", errorMessage: data.message ?? "resend_error" });
      throw new Error(data.message ?? "resend_error");
    }
    await logEmail({ to, subject, template, tenantId, status: "sent", providerId: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    await logEmail({ to, subject, template, tenantId, status: "failed", errorMessage: message });
    throw err;
  }
}

interface LogInput {
  to: string;
  subject: string;
  template?: string;
  tenantId?: string | null;
  status: string;
  providerId?: string;
  errorMessage?: string;
}

async function logEmail(input: LogInput): Promise<void> {
  try {
    await prisma.emailLog.create({
      data: {
        to: input.to,
        subject: input.subject,
        template: input.template,
        tenantId: input.tenantId ?? null,
        status: input.status,
        providerId: input.providerId,
        errorMessage: input.errorMessage,
      },
    });
  } catch (err) {
    console.error("[mailer] log failed:", err);
  }
}

// ─── Templates ───────────────────────────────────────────────────────────────

import { getAppUrl } from "./app-url";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "NextPolyglot";

export async function sendMagicLink(to: string, token: string): Promise<void> {
  const APP_URL = await getAppUrl();
  const url = `${APP_URL}/auth/magic-link?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to,
    subject: `Sign in to ${APP_NAME}`,
    template: "magic-link",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2 style="color:#f97316">Sign in to ${APP_NAME}</h2>
        <p>Click the link below to sign in. It expires in 15 minutes.</p>
        <p style="margin:24px 0">
          <a href="${url}" style="background:#f97316;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">Sign in</a>
        </p>
        <p style="color:#64748b;font-size:14px">Or copy this link: <br><code>${url}</code></p>
        <p style="color:#64748b;font-size:12px;margin-top:32px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendInvitation(to: string, tenantName: string, token: string, inviterName: string): Promise<void> {
  const APP_URL = await getAppUrl();
  const url = `${APP_URL}/auth/accept-invite?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to,
    subject: `${inviterName} invited you to ${tenantName}`,
    template: "invitation",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2 style="color:#f97316">You're invited to ${tenantName}</h2>
        <p><strong>${inviterName}</strong> invited you to collaborate on <strong>${tenantName}</strong> via ${APP_NAME}.</p>
        <p style="margin:24px 0">
          <a href="${url}" style="background:#f97316;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">Accept invitation</a>
        </p>
        <p style="color:#64748b;font-size:14px">Link expires in 7 days.</p>
      </div>
    `,
  });
}

export async function sendPasswordReset(to: string, token: string): Promise<void> {
  const APP_URL = await getAppUrl();
  const url = `${APP_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to,
    subject: `Reset your ${APP_NAME} password`,
    template: "password-reset",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2 style="color:#f97316">Reset your password</h2>
        <p>Click below to set a new password. The link expires in 30 minutes.</p>
        <p style="margin:24px 0">
          <a href="${url}" style="background:#f97316;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">Reset password</a>
        </p>
        <p style="color:#64748b;font-size:12px;margin-top:32px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}
