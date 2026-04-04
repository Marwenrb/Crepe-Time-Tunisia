import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";
import { API_BASE_URL, HAS_WORKING_API_URL } from "@/lib/runtime-config";

export const useGetRestaurant = (restaurantId?: string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    if (!HAS_WORKING_API_URL) {
      throw new Error("API base URL is not configured");
    }

    // No UUID (e.g. at /menu): discover restaurant by city — no hardcoded ID needed
    const url = restaurantId
      ? `${API_BASE_URL}/api/restaurant/${restaurantId}`
      : `${API_BASE_URL}/api/restaurant/default/Nabeul`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: restaurant, isLoading } = useQuery(
    // Per-ID key prevents stale-cache collision between /menu and /detail/:id
    ["fetchRestaurant", restaurantId ?? "default"],
    getRestaurantByIdRequest,
    {
      enabled: true, // always run — falls back to /default/Nabeul when no UUID
    }
  );

  return { restaurant, isLoading };
};

export const useSearchRestaurants = (
  searchState: SearchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    if (!HAS_WORKING_API_URL) {
      throw new Error("API base URL is not configured");
    }

    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: results, isLoading, isError } = useQuery(
    ["searchRestaurants", searchState],
    createSearchRequest,
    { enabled: !!city, retry: false }
  );

  return {
    results,
    isLoading,
    isError,
  };
};
