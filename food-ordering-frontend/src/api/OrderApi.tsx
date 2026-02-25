import { Order } from "@/types";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api-client";

export const useGetMyOrders = () => {
  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const res = await axiosInstance.get("/api/order");
    return res.data;
  };

  const { data: orders, isLoading } = useQuery(
    "fetchMyOrders",
    getMyOrdersRequest,
    {
      enabled: !!localStorage.getItem("session_id"),
      refetchInterval: 5000,
    }
  );

  return { orders, isLoading };
};

type CreateOrderRequest = {
  cartItems: { menuItemId: string; name: string; quantity: string }[];
  deliveryDetails: { email: string; name: string; addressLine1: string; city: string };
  restaurantId: string;
  paymentMethod: string;
};

export const useCreateOrder = () => {
  const createOrderRequest = async (
    req: CreateOrderRequest
  ) => {
    const res = await axiosInstance.post(
      "/api/order/create",
      req
    );
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
