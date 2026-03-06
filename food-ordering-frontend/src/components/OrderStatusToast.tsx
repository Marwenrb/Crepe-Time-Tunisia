import { OrderStatus } from "@/types";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/lib/statusUtils";

interface OrderStatusToastProps {
  status: OrderStatus;
  customerName: string;
  orderId: string;
}

const getStatusMessage = (status: OrderStatus) => {
  switch (status) {
    case "placed":
      return "Order placed successfully";
    case "confirmed":
      return "Payment confirmed";
    case "inProgress":
      return "Order is being prepared";
    case "outForDelivery":
      return "Order is out for delivery";
    case "delivered":
      return "Order delivered successfully";
    default:
      return "Order status updated";
  }
};

export const showOrderStatusToast = ({
  status,
  customerName,
  orderId,
}: OrderStatusToastProps) => {
  toast.success(
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
      </div>
      <div className="flex flex-col">
        <div className="font-medium">{getStatusMessage(status)}</div>
        <div className="text-sm text-muted-foreground">
          {customerName} • Order #{orderId.slice(-6)}
        </div>
      </div>
    </div>,
    {
      duration: 4000,
      position: "bottom-right",
      style: {
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    }
  );
};

export const showOrderErrorToast = (message: string) => {
  toast.error(
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-red-100 text-red-800">
        <AlertCircle className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <div className="font-medium">Update Failed</div>
        <div className="text-sm text-muted-foreground">{message}</div>
      </div>
    </div>,
    {
      duration: 5000,
      position: "bottom-right",
      style: {
        background: "white",
        border: "1px solid #ef4444",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    }
  );
};
