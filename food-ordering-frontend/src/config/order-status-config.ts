import { OrderStatus } from "@/types";

type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progressValue: number;
};

export const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Commande reçue", value: "placed", progressValue: 0 },
  {
    label: "Confirmée par le restaurant",
    value: "confirmed",
    progressValue: 25,
  },
  { label: "En préparation", value: "inProgress", progressValue: 50 },
  { label: "En livraison", value: "outForDelivery", progressValue: 75 },
  { label: "Livrée", value: "delivered", progressValue: 100 },
];
