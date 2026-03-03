// Crêpe Time Tunisia — Edge Function: Client Email Notifications via Resend
// Triggered by Database Webhook on orders INSERT/UPDATE
// Premium HTML emails (FR/AR), gold/purple theme, error logging to email_logs

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "Crêpe Time Tunisia <onboarding@resend.dev>";
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 min
const MAX_EMAILS_PER_ORDER = 3; // soft limit per order in window

const recentSends = new Map<string, number[]>();

function checkRateLimit(orderId: string): boolean {
  const now = Date.now();
  const timestamps = recentSends.get(orderId) ?? [];
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const filtered = timestamps.filter((t) => t > windowStart);
  if (filtered.length >= MAX_EMAILS_PER_ORDER) return false;
  filtered.push(now);
  recentSends.set(orderId, filtered);
  return true;
}

interface DeliveryDetails {
  name?: string;
  email?: string;
  addressLine1?: string;
  city?: string;
  phone?: string;
}

interface CartItem {
  name?: string;
  quantity?: string | number;
}

interface OrderRecord {
  id: string;
  status: string;
  delivery_details: DeliveryDetails;
  cart_items: CartItem[];
  total_amount: number;
  created_at?: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE";
  table: string;
  record: OrderRecord;
  old_record?: OrderRecord;
}

const STATUS_LABELS: Record<string, { fr: string; ar: string }> = {
  placed: { fr: "Reçue", ar: "تم الاستلام" },
  confirmed: { fr: "Confirmée", ar: "مؤكدة" },
  inProgress: { fr: "En préparation", ar: "قيد التحضير" },
  outForDelivery: { fr: "En livraison", ar: "في الطريق" },
  delivered: { fr: "Livrée", ar: "تم التوصيل" },
};

function formatTND(millimes: number): string {
  return `${(millimes / 100).toFixed(2)} TND`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(
  order: OrderRecord,
  type: "confirmation" | "status_update",
  frontendUrl: string
): string {
  const details = order.delivery_details || {};
  const name = escapeHtml(details.name || "Client");
  const totalTND = formatTND(order.total_amount || 0);
  const orderLink = `${frontendUrl.replace(/\/$/, "")}/order-status?orderId=${order.id}`;
  const statusInfo = STATUS_LABELS[order.status] || {
    fr: order.status,
    ar: order.status,
  };

  const cartRows = (order.cart_items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#334155;">${escapeHtml(String(item.name || "—"))}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;text-align:center;color:#64748b;">${item.quantity ?? 1}</td>
        </tr>`
    )
    .join("");

  const isNewOrder = type === "confirmation";

  return `
<!DOCTYPE html>
<html dir="ltr" lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Crêpe Time Tunisia — ${isNewOrder ? "Confirmation" : "Mise à jour"} de commande</title>
</head>
<body style="margin:0;font-family:'Segoe UI',Tahoma,Geneva,sans-serif;background:#f8fafc;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#4C1D95 0%,#7C3AED 50%,#A78BFA 100%);border-radius:16px;padding:32px;color:#fff;text-align:center;">
      <h1 style="margin:0;font-size:28px;">🧇 Crêpe Time Tunisia</h1>
      <p style="margin:8px 0 0;opacity:0.95;font-size:14px;">The Sweetest Escape</p>
      <p style="margin:20px 0 0;font-size:18px;font-weight:600;">
        ${isNewOrder ? "🍪 Commande reçue !" : "📦 Mise à jour de votre commande"}
      </p>
    </div>

    <div style="background:#fff;border-radius:12px;padding:24px;margin-top:16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <p style="margin:0 0 16px;font-size:16px;color:#334155;">
        Bonjour <strong>${name}</strong>,
      </p>
      <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
        ${isNewOrder ? "Nous avons bien reçu votre commande. Nos crêpiers préparent déjà vos délices !" : `Le statut de votre commande a été mis à jour : <strong>${statusInfo.fr}</strong> (${statusInfo.ar})`}
      </p>

      <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-radius:8px;padding:16px;margin:20px 0;border:1px solid #fcd34d;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:8px 12px;text-align:left;color:#92400e;">Article</th>
              <th style="padding:8px 12px;text-align:center;color:#92400e;">Qté</th>
            </tr>
          </thead>
          <tbody>${cartRows}</tbody>
        </table>
        <p style="margin:12px 0 0;font-size:18px;font-weight:700;color:#4C1D95;">
          Total : ${totalTND}
        </p>
      </div>

      <a href="${orderLink}" style="display:inline-block;background:linear-gradient(135deg,#4C1D95,#7C3AED);color:#fff!important;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px;">
        Suivre ma commande →
      </a>

      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
        Crêpe Time Tunisia — Nabeul, Tunisie<br>
        Livraison & retrait en boutique
      </p>
    </div>
  </div>
</body>
</html>`;
}

async function logEmail(
  supabaseClient: ReturnType<typeof createClient>,
  orderId: string,
  recipient: string,
  emailType: string,
  status: "sent" | "failed",
  errorMsg?: string
): Promise<void> {
  try {
    await supabaseClient.from("email_logs").insert({
      order_id: orderId,
      email_type: emailType,
      recipient_email: recipient,
      status,
      error_message: errorMsg ?? null,
    });
  } catch (e) {
    console.error("[notify-client] Failed to log email:", e);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const frontendUrl = Deno.env.get("FRONTEND_URL");

  if (!resendKey) {
    console.error("[notify-client] RESEND_API_KEY not set");
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!frontendUrl) {
    console.warn("[notify-client] FRONTEND_URL not set, using default");
  }

  const effectiveFrontendUrl = frontendUrl || "http://localhost:5173";

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseClient =
    supabaseUrl && supabaseKey
      ? createClient(supabaseUrl, supabaseKey)
      : null;

  try {
    const payload: WebhookPayload = await req.json();
    const { type, record } = payload;

    if (payload.table !== "orders" || !record) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const details = record.delivery_details as DeliveryDetails | undefined;
    const email = details?.email?.trim();
    if (!email) {
      return new Response(
        JSON.stringify({ message: "No email in delivery_details, skipping" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!checkRateLimit(record.id)) {
      console.warn("[notify-client] Rate limit exceeded for order", record.id);
      return new Response(
        JSON.stringify({ message: "Rate limit exceeded" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    let emailType: "confirmation" | "status_update";
    let subject: string;

    if (type === "INSERT") {
      emailType = "confirmation";
      subject = `🧇 Crêpe Time — Commande reçue #${String(record.id).slice(-6)}`;
    } else if (type === "UPDATE") {
      emailType = "status_update";
      subject = `📦 Crêpe Time — Mise à jour commande #${String(record.id).slice(-6)}`;
    } else {
      return new Response(
        JSON.stringify({ message: "Ignored event type" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const html = buildEmailHtml(record, emailType, effectiveFrontendUrl);

    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[notify-client] Resend error:", res.status, errBody);
      if (supabaseClient) {
        await logEmail(
          supabaseClient,
          record.id,
          email,
          emailType,
          "failed",
          `Resend ${res.status}: ${errBody}`
        );
      }
      return new Response(
        JSON.stringify({ error: "Email send failed", details: errBody }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    if (supabaseClient) {
      await logEmail(
        supabaseClient,
        record.id,
        email,
        emailType,
        "sent"
      );
    }

    console.log("[notify-client] Email sent:", emailType, record.id);
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[notify-client] Error:", e);
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
