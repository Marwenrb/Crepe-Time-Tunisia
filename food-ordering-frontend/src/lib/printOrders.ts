import type { Order } from "@/types";

const getDeliveryDetails = (order: Order) => {
  const d = order.deliveryDetails || (order as { delivery_details?: Record<string, unknown> }).delivery_details;
  return {
    name: String(d?.name ?? "N/A"),
    addressLine1: String(d?.addressLine1 ?? (d as Record<string, unknown>)?.address_line1 ?? ""),
    city: String(d?.city ?? ""),
    email: String(d?.email ?? ""),
    phone: String(d?.phone ?? ""),
  };
};

const formatCurrency = (amount: number) => {
  const safe = Number(amount) || 0;
  return `${(safe / 100).toFixed(2)} TND`;
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    placed: "Commande reçue",
    confirmed: "Confirmée",
    inProgress: "En préparation",
    outForDelivery: "En livraison",
    delivered: "Livrée",
  };
  return map[status] ?? status;
};

const orderToHtml = (order: Order, index?: number) => {
  const details = getDeliveryDetails(order);
  const restaurantName = (order.restaurant as { restaurantName?: string })?.restaurantName ?? "Crêpe Time";
  return `
    <div class="order-print" style="border: 1px solid #333; padding: 12px; margin-bottom: 16px; page-break-inside: avoid;">
      ${index !== undefined ? `<div style="font-size: 10px; color: #666;">Commande ${index + 1}</div>` : ""}
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${restaurantName}</div>
      <div style="font-size: 12px; margin-bottom: 4px;"><strong>Client:</strong> ${details.name}</div>
      <div style="font-size: 12px; margin-bottom: 4px;"><strong>Adresse:</strong> ${details.addressLine1}, ${details.city}</div>
      ${details.phone ? `<div style="font-size: 12px; margin-bottom: 4px;"><strong>Tél:</strong> ${details.phone}</div>` : ""}
      <div style="font-size: 12px; margin-bottom: 4px;"><strong>Email:</strong> ${details.email || "—"}</div>
      <div style="font-size: 12px; margin-bottom: 8px;"><strong>Date:</strong> ${formatDateTime(order.createdAt)} | <strong>Statut:</strong> ${getStatusLabel(order.status)}</div>
      <div style="border-top: 1px dashed #999; padding-top: 8px; margin-top: 8px;">
        <div style="font-weight: bold; font-size: 11px; margin-bottom: 4px;">Articles:</div>
        ${(order.cartItems || []).map((item) => `<div style="font-size: 11px;">• ${item.quantity}x ${item.name}</div>`).join("")}
      </div>
      <div style="font-weight: bold; font-size: 13px; margin-top: 8px;">Total: ${formatCurrency(order.totalAmount ?? 0)}</div>
    </div>
  `;
};

export function printOrders(orders: Order[], title?: string) {
  if (orders.length === 0) return;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title ?? "Commandes - Crêpe Time"}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 16px; font-size: 12px; }
    h1 { font-size: 18px; margin-bottom: 16px; }
    .order-print { }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px;">
    <button onclick="window.print()" style="padding: 8px 16px; cursor: pointer; font-size: 14px;">Imprimer</button>
    <button onclick="window.close()" style="padding: 8px 16px; cursor: pointer; margin-left: 8px;">Fermer</button>
  </div>
  <h1>${title ?? "Commandes - Crêpe Time"}</h1>
  <div style="font-size: 11px; color: #666; margin-bottom: 12px;">Imprimé le ${new Date().toLocaleString("fr-FR")} — ${orders.length} commande(s)</div>
  ${orders.map((o, i) => orderToHtml(o, orders.length > 1 ? i : undefined)).join("")}
</body>
</html>
  `;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  }
}
