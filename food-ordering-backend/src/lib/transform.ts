/**
 * Transform Supabase rows to API format (_id) for frontend compatibility with MongoDB-style responses.
 */

export function toApiFormat<T extends Record<string, unknown>>(row: T | null): (T & { _id: string }) | null {
  if (!row) return null;
  const r = row as Record<string, unknown>;
  const { id, address_line1, image, ...rest } = r;
  return {
    ...rest,
    _id: (id as string) || "",
    addressLine1: address_line1,
    imageUrl: image || undefined,
  } as unknown as T & { _id: string };
}

export function toApiFormatArray<T extends Record<string, unknown>>(rows: T[] | null): (T & { _id: string })[] {
  return (rows || []).map((r) => toApiFormat(r)!);
}

/** Transform restaurant row: snake_case -> camelCase, menu_items with _id */
export function transformRestaurant(row: Record<string, unknown> | null) {
  if (!row) return null;
  const menuItems = (row.menu_items as Array<{ id?: string; _id?: string; name: string; price: number; imageUrl?: string }>) || [];
  const menuItemsApi = menuItems.map((m) => ({
    _id: m.id || m._id || "",
    name: m.name,
    price: m.price,
    imageUrl: m.imageUrl,
  }));
  return {
    _id: row.id,
    user: row.user_id,
    restaurantName: row.restaurant_name,
    city: row.city,
    country: row.country,
    deliveryPrice: row.delivery_price,
    estimatedDeliveryTime: row.estimated_delivery_time,
    cuisines: row.cuisines || [],
    menuItems: menuItemsApi,
    imageUrl: row.image_url,
    lastUpdated: row.last_updated,
  };
}

/** Transform order row for API response */
export function transformOrder(row: Record<string, unknown> | null, restaurant?: Record<string, unknown> | null, user?: Record<string, unknown> | null) {
  if (!row) return null;
  const base = {
    _id: row.id,
    restaurantId: row.restaurant_id,
    restaurant: restaurant ? transformRestaurant(restaurant) : { _id: row.restaurant_id },
    user: user ? toApiFormat(user as Record<string, unknown>) : null,
    user_id: row.user_id,
    deliveryDetails: row.delivery_details,
    cartItems: row.cart_items || [],
    totalAmount: row.total_amount,
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
  };
  return base;
}
