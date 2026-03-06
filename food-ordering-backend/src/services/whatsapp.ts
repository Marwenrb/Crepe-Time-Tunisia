/**
 * WhatsApp Notification Service — Crêpe Time
 * ============================================
 * Two-channel, fault-tolerant notification system:
 *
 *  CHANNEL A — Meta WhatsApp Business API (server-side, automatic)
 *    • Sends order details directly to the restaurant's WhatsApp
 *      WITHOUT requiring any client interaction.
 *    • Sends a confirmation receipt to the customer's WhatsApp
 *      when their phone number is supplied.
 *    • Requires env vars: WHATSAPP_API_TOKEN, WHATSAPP_API_PHONE_ID
 *    • Uses Graph API v20 with exponential back-off retry (2 retries).
 *
 *  CHANNEL B — wa.me deep-link URL (client-side fallback)
 *    • Always generated, returned to frontend regardless of API status.
 *    • Frontend opens it in a new tab so the customer can send manually
 *      if Channel A is unavailable or not yet configured.
 *
 * Environment variables:
 *   WHATSAPP_RESTAURANT_PHONE — E.164 restaurant number (default +21625799066)
 *   WHATSAPP_API_TOKEN        — Bearer token from Meta Business Manager
 *   WHATSAPP_API_PHONE_ID     — Phone-Number-ID from Meta Business Manager
 *
 * See /docs/WHATSAPP_SETUP.md for a step-by-step credential guide.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  deliveryAddress: string;
  cartItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cash" | "pickup";
}

export interface WhatsAppResult {
  /** true = Meta API successfully notified the restaurant automatically */
  restaurantNotified: boolean;
  /** true = Meta API sent a confirmation receipt to the customer */
  customerNotified: boolean;
  /** Always set — wa.me deep-link for the manual send fallback */
  whatsappUrl: string;
  /** Set only when the Meta API attempt was made but failed */
  apiError?: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const RESTAURANT_PHONE = (
  process.env.WHATSAPP_RESTAURANT_PHONE || "+21625799066"
).replace(/\s/g, "");

const META_API_VERSION = "v20.0";
const META_API_BASE = "https://graph.facebook.com";

// ── Formatters ────────────────────────────────────────────────────────────────

function formatDate(): string {
  return new Intl.DateTimeFormat("fr-TN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function formatTime(): string {
  return new Intl.DateTimeFormat("fr-TN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

/** Prices are stored in millimes (1 TND = 100 millimes) */
function formatPrice(amountInMillimes: number): string {
  return (amountInMillimes / 100).toFixed(2);
}

function getPaymentLabel(method: "cash" | "pickup"): string {
  return method === "cash" ? "الدفع عند التوصيل 🚗" : "استلام من المحل 🏪";
}

// ── Message builders ──────────────────────────────────────────────────────────

/** Full order notification sent to the RESTAURANT */
export function buildRestaurantMessage(order: OrderDetails): string {
  const items = order.cartItems
    .map(
      (item) =>
        `  • ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)} TND`
    )
    .join("\n");

  return `\u200F🧇 *طلب جديد — Crêpe Time*

📋 *رقم الطلب:* #${order.orderId.slice(-8).toUpperCase()}
📅 *التاريخ:* ${formatDate()}
⏰ *الوقت:* ${formatTime()}

👤 *العميل:* ${order.customerName}${order.customerPhone ? `\n📱 *الهاتف:* ${order.customerPhone}` : ""}
📍 *العنوان:* ${order.deliveryAddress}

🛒 *تفاصيل الطلب:*
${items}

━━━━━━━━━━━━━━━
💰 *المجموع الفرعي:* ${formatPrice(order.subtotal)} TND
🚗 *التوصيل:* ${formatPrice(order.deliveryFee)} TND
✨ *المجموع الكلي:* ${formatPrice(order.total)} TND
━━━━━━━━━━━━━━━

💳 *طريقة الدفع:* ${getPaymentLabel(order.paymentMethod)}

🙏 شكراً لاختياركم كريب تايم!
يرجى تأكيد الطلب في أقرب وقت.`;
}

/** Compact confirmation receipt sent to the CUSTOMER */
export function buildCustomerConfirmationMessage(order: OrderDetails): string {
  const items = order.cartItems
    .map((item) => `  • ${item.quantity}x ${item.name}`)
    .join("\n");

  return `\u200F✅ *طلبك تم استلامه — Crêpe Time*

مرحباً *${order.customerName}*، شكراً لطلبك! 🧇

📋 *رقم الطلب:* #${order.orderId.slice(-8).toUpperCase()}
🛒 *طلبك:*
${items}

✨ *المجموع:* ${formatPrice(order.total)} TND
💳 *الدفع:* ${getPaymentLabel(order.paymentMethod)}
📍 *التوصيل إلى:* ${order.deliveryAddress}

⏱ سيتواصل معك فريقنا قريباً لتأكيد وقت التوصيل.

━━━━━━━━━━━━
🧇 *Crêpe Time* — Nabeul
Merci pour votre confiance ! 🙏`;
}

/** wa.me deep-link URL pointing to the RESTAURANT number with the full order message */
export function buildWhatsAppUrl(order: OrderDetails): string {
  const phone = RESTAURANT_PHONE.replace(/[^0-9+]/g, "");
  const encoded = encodeURIComponent(buildRestaurantMessage(order));
  return `https://wa.me/${phone}?text=${encoded}`;
}

// Keep legacy export alias for backwards compatibility
export const buildWhatsAppMessage = buildRestaurantMessage;

// ── Meta API helper ───────────────────────────────────────────────────────────

interface MetaApiConfig {
  token: string;
  phoneId: string;
}

/**
 * Send a plain-text WhatsApp message via Meta Graph API.
 * Retries up to `maxRetries` times with exponential back-off.
 * Returns `{ ok: true }` on success or `{ ok: false, error }` on failure.
 */
async function sendViaMetaApi(
  to: string,
  body: string,
  config: MetaApiConfig,
  maxRetries = 2
): Promise<{ ok: boolean; error?: string }> {
  const url = `${META_API_BASE}/${META_API_VERSION}/${config.phoneId}/messages`;
  const payload = JSON.stringify({
    messaging_product: "whatsapp",
    to: to.replace(/\s/g, ""),
    type: "text",
    text: { body, preview_url: false },
  });

  let lastError = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      // Exponential back-off: 500ms, 1000ms
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
        signal: AbortSignal.timeout(10_000), // 10-second timeout per attempt
      });

      if (res.ok) return { ok: true };

      // Parse Meta error for helpful logging
      let detail = `HTTP ${res.status}`;
      try {
        const json = (await res.json()) as {
          error?: { message?: string; code?: number };
        };
        detail = json?.error?.message
          ? `[${json.error.code}] ${json.error.message}`
          : detail;
      } catch {
        /* ignore JSON parse failure */
      }

      lastError = detail;

      // Don't retry on auth errors (401 / 403) or bad-request (400)
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        console.error(`[WhatsApp] Meta API non-retryable error: ${detail}`);
        return { ok: false, error: detail };
      }

      console.warn(
        `[WhatsApp] Meta API attempt ${attempt + 1}/${maxRetries + 1} failed: ${detail}`
      );
    } catch (err: unknown) {
      lastError =
        err instanceof Error ? err.message : "Network / timeout error";
      console.warn(
        `[WhatsApp] Meta API attempt ${attempt + 1}/${maxRetries + 1} threw: ${lastError}`
      );
    }
  }

  return { ok: false, error: lastError };
}

// ── Primary export ────────────────────────────────────────────────────────────

/**
 * Send all WhatsApp notifications for a new order.
 *
 * Behaviour:
 *  1. Always builds the `whatsappUrl` deep-link (Channel B fallback).
 *  2. If `WHATSAPP_API_TOKEN` + `WHATSAPP_API_PHONE_ID` are set:
 *     a. Sends the full order notification to the restaurant (Channel A).
 *     b. If `customerPhone` is provided, sends a confirmation receipt
 *        to the customer as a separate message (Channel A).
 *  3. Returns a `WhatsAppResult` for the controller to pass back to the
 *     frontend so it can decide whether to open the deep-link or not.
 */
export async function sendWhatsAppNotification(
  order: OrderDetails
): Promise<WhatsAppResult> {
  const whatsappUrl = buildWhatsAppUrl(order);

  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_API_PHONE_ID;

  // Channel B only — no API credentials configured
  if (!token || !phoneId) {
    console.info(
      "[WhatsApp] No API credentials — using wa.me fallback URL only."
    );
    return {
      restaurantNotified: false,
      customerNotified: false,
      whatsappUrl,
    };
  }

  const config: MetaApiConfig = { token, phoneId };
  let restaurantNotified = false;
  let customerNotified = false;
  let apiError: string | undefined;

  // ── A1: Notify restaurant ─────────────────────────────────────────────────
  const restoResult = await sendViaMetaApi(
    RESTAURANT_PHONE,
    buildRestaurantMessage(order),
    config
  );

  if (restoResult.ok) {
    restaurantNotified = true;
    console.info(
      `[WhatsApp] ✓ Restaurant notified — order #${order.orderId.slice(-8).toUpperCase()}`
    );
  } else {
    apiError = restoResult.error;
    console.error(
      `[WhatsApp] ✗ Restaurant notification failed — order #${order.orderId.slice(-8).toUpperCase()}: ${apiError}`
    );
  }

  // ── A2: Confirm to customer (best-effort, never blocks the order) ─────────
  const rawPhone = order.customerPhone?.replace(/\s/g, "");
  if (rawPhone && rawPhone.length >= 8) {
    const customerResult = await sendViaMetaApi(
      rawPhone,
      buildCustomerConfirmationMessage(order),
      config
    );

    if (customerResult.ok) {
      customerNotified = true;
      console.info(
        `[WhatsApp] ✓ Customer confirmation sent to ${rawPhone}`
      );
    } else {
      console.warn(
        `[WhatsApp] ✗ Customer confirmation failed for ${rawPhone}: ${customerResult.error}`
      );
    }
  }

  return { restaurantNotified, customerNotified, whatsappUrl, apiError };
}

export default {
  buildRestaurantMessage,
  buildCustomerConfirmationMessage,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  sendWhatsAppNotification,
};
