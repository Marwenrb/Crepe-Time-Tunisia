import { useState, useCallback } from "react";
import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import { useOrdersRealtime } from "@/hooks/useOrdersRealtime";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import EnhancedOrdersTab from "@/components/EnhancedOrdersTab";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Printer } from "lucide-react";
import { useQueryClient } from "react-query";
import { printOrders } from "@/lib/printOrders";

type BatchPrintRange = "1h" | "today" | "week" | "month" | "all";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateMyRestaurant();

  const {
    orders,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
    refetch,
  } = useGetMyRestaurantOrders(!!restaurant);
  const queryClient = useQueryClient();
  const [batchPrintRange, setBatchPrintRange] = useState<BatchPrintRange>("today");

  const handleRealtimeOrderChange = useCallback(() => {
    queryClient.invalidateQueries("fetchMyRestaurantOrders");
    refetch();
  }, [queryClient, refetch]);

  useOrdersRealtime(restaurant?._id, handleRealtimeOrderChange, {
    enabled: !!restaurant?._id,
    playSound: true,
  });

  const isEditing = !!restaurant;

  const allOrders = orders ?? [];
  const placedOrders = allOrders.filter((order) => order.status === "placed");
  const managedOrders = allOrders.filter((order) =>
    ["confirmed", "inProgress", "outForDelivery", "delivered"].includes(order.status)
  );

  const handleRefreshOrders = () => {
    queryClient.invalidateQueries("fetchMyRestaurantOrders");
    refetch();
  };

  const getOrdersForBatchPrint = () => {
    const now = new Date();
    let cutoff: Date;
    switch (batchPrintRange) {
      case "1h":
        cutoff = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "today":
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return allOrders;
    }
    return allOrders.filter((o) => new Date(o.createdAt) >= cutoff);
  };

  const handleBatchPrint = () => {
    const toPrint = getOrdersForBatchPrint();
    const labels: Record<BatchPrintRange, string> = {
      "1h": "Dernière heure",
      today: "Aujourd'hui",
      week: "Cette semaine",
      month: "Ce mois",
      all: "Toutes les commandes",
    };
    printOrders(toPrint, `Commandes - ${labels[batchPrintRange]} (${toPrint.length})`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Restaurant</h1>
        <Button
          onClick={handleRefreshOrders}
          disabled={ordersLoading || ordersFetching}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${ordersFetching ? "animate-spin" : ""}`}
          />
          Refresh Orders
        </Button>
      </div>

      {/* Batch Print */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Imprimer les commandes en lot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={batchPrintRange} onValueChange={(v) => setBatchPrintRange(v as BatchPrintRange)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Dernière heure</SelectItem>
                <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                <SelectItem value="week">Cette semaine (7 jours)</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="all">Toutes les commandes</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="default"
              onClick={handleBatchPrint}
              disabled={allOrders.length === 0}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimer ({getOrdersForBatchPrint().length} commande(s))
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="new-orders">
        <TabsList>
          <TabsTrigger value="new-orders">
            Nouvelles commandes ({placedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="orders">En cours / Livrées</TabsTrigger>
          <TabsTrigger value="manage-restaurant">Gérer le restaurant</TabsTrigger>
        </TabsList>
        <TabsContent
          value="new-orders"
          className="space-y-5 bg-gray-50 p-10 rounded-lg"
        >
          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="text-lg font-medium">Chargement...</div>
            </div>
          ) : placedOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune nouvelle commande
            </div>
          ) : (
            <EnhancedOrdersTab
              orders={placedOrders}
              showStatusSelector={true}
            />
          )}
        </TabsContent>
        <TabsContent
          value="orders"
          className="space-y-5 bg-gray-50 p-10 rounded-lg"
        >
          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="text-lg font-medium">Chargement...</div>
            </div>
          ) : (
            <EnhancedOrdersTab
              orders={managedOrders}
              showStatusSelector={true}
            />
          )}
        </TabsContent>
        <TabsContent value="manage-restaurant">
          <ManageRestaurantForm
            restaurant={restaurant}
            onSave={isEditing ? updateRestaurant : createRestaurant}
            isLoading={isCreateLoading || isUpdateLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageRestaurantPage;
