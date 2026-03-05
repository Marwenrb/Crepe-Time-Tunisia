interface OrderDetails {
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

const RESTAURANT_PHONE = process.env.WHATSAPP_RESTAURANT_PHONE || "+21625799066";

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

function formatPrice(amountInMillimes: number): string {
  return (amountInMillimes / 100).toFixed(2);
}

function getPaymentMethodArabic(method: "cash" | "pickup"): string {
  return method === "cash" ? "الدفع عند التوصيل 🚗" : "استلام من المحل 🏪";
}

export function buildWhatsAppMessage(order: OrderDetails): string {
  const itemsText = order.cartItems
    .map((item) => `  • ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)} TND`)
    .join("\n");

  const message = `‎🧇 *طلب جديد — Crêpe Time*

📋 *رقم الطلب:* #${order.orderId.slice(-8).toUpperCase()}
📅 *التاريخ:* ${formatDate()}
⏰ *الوقت:* ${formatTime()}

👤 *العميل:* ${order.customerName}${order.customerPhone ? `\n📱 *الهاتف:* ${order.customerPhone}` : ""}
📍 *العنوان:* ${order.deliveryAddress}

🛒 *تفاصيل الطلب:*
${itemsText}

━━━━━━━━━━━━━━━
💰 *المجموع الفرعي:* ${formatPrice(order.subtotal)} TND
🚗 *التوصيل:* ${formatPrice(order.deliveryFee)} TND
✨ *المجموع الكلي:* ${formatPrice(order.total)} TND
━━━━━━━━━━━━━━━

💳 *طريقة الدفع:* ${getPaymentMethodArabic(order.paymentMethod)}

🙏 شكراً لاختياركم كريب تايم!
يرجى تأكيد الطلب في أقرب وقت.`;

  return message;
}

export function buildWhatsAppUrl(order: OrderDetails): string {
  const phone = RESTAURANT_PHONE.replace(/[^0-9+]/g, "");
  const message = buildWhatsAppMessage(order);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export async function sendWhatsAppNotification(order: OrderDetails): Promise<{ sent: boolean; whatsappUrl: string }> {
  const whatsappUrl = buildWhatsAppUrl(order);

  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_API_PHONE_ID;

  if (apiToken && phoneId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: RESTAURANT_PHONE,
            type: "text",
            text: { body: buildWhatsAppMessage(order) },
          }),
        }
      );

      if (response.ok) {
        return { sent: true, whatsappUrl };
      }
      console.error("WhatsApp API error:", await response.text());
    } catch (error) {
      console.error("WhatsApp API call failed:", error);
    }
  }

  return { sent: false, whatsappUrl };
}

export default {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  sendWhatsAppNotification,
};
