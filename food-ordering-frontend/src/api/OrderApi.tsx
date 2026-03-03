import { Order } from "@/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api-client";

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
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId)) return null;
      try {
        const res = await axiosInstance.get(`/api/order/track/${orderId}`);
        return res.data ?? null;
      } catch {
        return null;
      }
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
  const queryClient = useQueryClient();
  const createOrderRequest = async (req: CreateOrderRequest) => {
    const res = await axiosInstance.post("/api/order/create", req);
    return res.data;
  };

  const { mutateAsync: createOrder, isLoading, error, reset } =
    useMutation(createOrderRequest, {
      onSuccess: (data) => {
        queryClient.invalidateQueries("fetchMyOrders");
        const orderId = data?.order?._id ?? data?.order?.id ?? data?.id;
        if (orderId) queryClient.invalidateQueries(["fetchOrderById", orderId]);
      },
    });

  if (error) {
    toast.error((error as Error).toString());
    reset();
  }

  return { createOrder, isLoading };
};

export const useCreateGuestOrder = () => {
  const queryClient = useQueryClient();
  const createGuestOrderRequest = async (req: CreateOrderRequest) => {
    const res = await axiosInstance.post("/api/order/create-guest", req);
    return res.data;
  };

  const { mutateAsync: createGuestOrder, isLoading, error, reset } =
    useMutation(createGuestOrderRequest, {
      onSuccess: (data) => {
        const orderId = data?.order?._id ?? data?.order?.id ?? data?.id;
        if (orderId) queryClient.invalidateQueries(["fetchOrderById", orderId]);
      },
    });

  if (error) {
    toast.error((error as Error).toString());
    reset();
  }

  return { createGuestOrder, isLoading };
};
