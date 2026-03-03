/**
 * Supabase Realtime subscription for orders — admin dashboard push-like updates.
 * Subscribes to postgres_changes on INSERT/UPDATE for a given restaurant.
 * Triggers toast + optional sound + refetch. Respects prefers-reduced-motion.
 */
import { useEffect, useRef, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Package } from "lucide-react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function playNewOrderSound(): void {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Silent fallback — no sound
  }
}

export interface RealtimeOrderPayload {
  id: string;
  restaurant_id: string;
  status: string;
  delivery_details?: { name?: string; email?: string };
  cart_items?: unknown[];
  total_amount?: number;
  created_at?: string;
}

export function useOrdersRealtime(
  restaurantId: string | undefined,
  onOrderChange: () => void,
  options?: { enabled?: boolean; playSound?: boolean }
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onOrderChangeRef = useRef(onOrderChange);
  onOrderChangeRef.current = onOrderChange;

  const { enabled = true, playSound: playSoundOpt = true } = options ?? {};
  const shouldPlaySound = playSoundOpt && !prefersReducedMotion();

  const stableOnChange = useCallback(() => {
    onOrderChangeRef.current();
  }, []);

  useEffect(() => {
    if (!restaurantId || !enabled) return;
    const client = supabase;
    if (!client?.channel) return;

    const channel = client
      .channel(`orders:${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          const record = (newRecord ?? oldRecord) as RealtimeOrderPayload | null;
          if (!record) return;

          const customerName =
            (record.delivery_details as { name?: string })?.name ?? "Client";
          const orderIdShort = String(record.id ?? "").slice(-6);

          if (eventType === "INSERT") {
            toast.success(
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 text-amber-800">
                  <span className="text-xl" aria-hidden>🍪</span>
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold">Nouvelle commande !</div>
                  <div className="text-sm text-muted-foreground">
                    {customerName} • Commande #{orderIdShort}
                  </div>
                </div>
              </div>,
              {
                duration: 6000,
                position: "bottom-right",
                style: {
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  border: "1px solid #f59e0b",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.3)",
                },
              }
            );
            if (shouldPlaySound) playNewOrderSound();
          } else if (eventType === "UPDATE") {
            toast.info(
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-800">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <div className="font-medium">Commande mise à jour</div>
                  <div className="text-sm text-muted-foreground">
                    {customerName} • #{orderIdShort} → {record.status}
                  </div>
                </div>
              </div>,
              {
                duration: 4000,
                position: "bottom-right",
              }
            );
          }

          stableOnChange();
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("[Realtime] Subscription error for orders");
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [restaurantId, enabled, shouldPlaySound, stableOnChange]);
}
