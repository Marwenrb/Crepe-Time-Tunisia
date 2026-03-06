/**
 * Shared order-status helpers
 *
 * Single source of truth for status colour classes and status icons.
 * Used by OrderStatusToast, EnhancedOrdersTab, OrderStatusPage, etc.
 */

import { AlertCircle, CheckCircle, Truck, ChefHat } from "lucide-react";
import type { OrderStatus } from "@/types";

/** Tailwind colour classes for each order status badge. */
export const getStatusColor = (status: OrderStatus | string): string => {
  switch (status) {
    case "placed":          return "bg-gray-100 text-gray-800";
    case "confirmed":       return "bg-blue-100 text-blue-800";
    case "inProgress":      return "bg-yellow-100 text-yellow-800";
    case "outForDelivery":  return "bg-orange-100 text-orange-800";
    case "delivered":       return "bg-green-100 text-green-800";
    default:                return "bg-gray-100 text-gray-800";
  }
};

/** Icon component for each order status. */
export const getStatusIcon = (status: OrderStatus | string): JSX.Element => {
  switch (status) {
    case "placed":          return <AlertCircle className="h-4 w-4" />;
    case "confirmed":       return <CheckCircle className="h-4 w-4" />;
    case "inProgress":      return <ChefHat className="h-4 w-4" />;
    case "outForDelivery":  return <Truck className="h-4 w-4" />;
    case "delivered":       return <CheckCircle className="h-4 w-4" />;
    default:                return <AlertCircle className="h-4 w-4" />;
  }
};
