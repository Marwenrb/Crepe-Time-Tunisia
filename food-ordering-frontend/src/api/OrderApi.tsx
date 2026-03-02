import { Order } from "@/types";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const useGetMyOrders = () => {
  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const res = await axiosInstance.get("/api/order");
    return res.data ?? [];
  };

  const { data: orders, isLoading, isError } = useQuery(
    "fetchMyOrders",
    getMyOrdersRequest,
    {
      enabled: !!localStorage.getItem("session_id"),
      refetchInterval: 5000,
      retry: 1,
    }
  );

  return { orders: orders ?? [], isLoading, isError };
};

/** Fetch a single order by ID (public, for guest tracking) */
export const useGetOrderById = (orderId: string | null) => {
  const { data: order, isLoading, isError } = useQuery(
    ["fetchOrderById", orderId],
    async (): Promise<Order | null> => {
      if (!orderId) return null;
      const res = await fetch(`${API_BASE_URL}/api/order/track/${orderId}`);
      if (!res.ok) return null;
      return res.json();
    },
    { enabled: !!orderId }
  );

  return { order: order ?? null, isLoading, isError };
};

type CreateOrderRequest = {
  cartItems: { menuItemId: string; name: string; quantity: string }[];
  deliveryDetails: {
    email?: string;
    name: string;
    addressLine1: string;
    city: string;
    country: string;
    phone?: string;
  };
  restaurantId: string;
  paymentMethod: string;
};

export const useCreateOrder = () => {
  const createOrderRequest = async (req: CreateOrderRequest) => {
    const res = await axiosInstance.post("/api/order/create", req);
    return res.data;
  };

  const { mutateAsync: createOrder, isLoading, error, reset } =
    useMutation(createOrderRequest);

  if (error) {
    toast.error((error as Error).toString());
    reset();
  }

  return { createOrder, isLoading };
};

export const useCreateGuestOrder = () => {
  const createGuestOrderRequest = async (req: CreateOrderRequest) => {
    const res = await axiosInstance.post("/api/order/create-guest", req);
    return res.data;
  };

  const { mutateAsync: createGuestOrder, isLoading, error, reset } =
    useMutation(createGuestOrderRequest);

  if (error) {
    toast.error((error as Error).toString());
    reset();
  }

  return { createGuestOrder, isLoading };
};
