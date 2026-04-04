import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, HAS_WORKING_API_URL } from "@/lib/runtime-config";

/** Cached restaurant ID from a previous successful load */
const CACHE_KEY = "crepetime_restaurant_id";

/** Hardcoded restaurant ID — env var takes precedence, fallback to known UUID */
const sanitizeId = (v: string) => {
  const match = v.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match ? match[0] : v.trim();
};
const STATIC_RESTAURANT_ID = sanitizeId(
  import.meta.env.VITE_RESTAURANT_ID || "3188b88d-b11f-4265-8e35-6f1d49c2b1dc"
);

const MenuPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [slowConnection, setSlowConnection] = useState(false);

  useEffect(() => {
    // 1. Env override — instant (set VITE_RESTAURANT_ID in Netlify)
    if (STATIC_RESTAURANT_ID) {
      navigate(`/detail/${STATIC_RESTAURANT_ID}`, { replace: true });
      return;
    }

    // 2. Cached from previous successful load — instant
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      navigate(`/detail/${cached}`, { replace: true });
      return;
    }

    // 3. Backend not configured — fail gracefully
    if (!HAS_WORKING_API_URL) {
      setError(true);
      return;
    }

    // 4. First-ever visit: fetch restaurant ID with "waking up" UX
    const slowTimer = setTimeout(() => setSlowConnection(true), 5000);

    const fetchAndRedirect = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/restaurant/default/Nabeul`);
        if (!res.ok) throw new Error("No restaurant found");
        const restaurant = await res.json();
        // Cache for instant navigation on all future visits
        if (restaurant._id) {
          localStorage.setItem(CACHE_KEY, restaurant._id);
        }
        navigate(`/detail/${restaurant._id}`, { replace: true });
      } catch {
        setError(true);
      } finally {
        clearTimeout(slowTimer);
      }
    };

    fetchAndRedirect();
    return () => clearTimeout(slowTimer);
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6 text-center">
        <div className="text-5xl">🥞</div>
        <span className="text-lg font-semibold text-gray-800">
          Le menu est momentanément indisponible.
        </span>
        <span className="text-sm text-muted-foreground max-w-sm">
          Le serveur redémarre automatiquement. Cela prend généralement 30 à 60 secondes.
        </span>
        <button
          onClick={() => {
            localStorage.removeItem(CACHE_KEY);
            window.location.reload();
          }}
          className="mt-2 px-6 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 p-6 text-center">
      <div className="relative mx-auto">
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
      <p className="text-sm font-medium text-gray-700">Chargement du menu…</p>
      {slowConnection && (
        <p className="text-xs text-muted-foreground max-w-xs">
          Le serveur se réveille, encore quelques secondes… 🥞
        </p>
      )}
    </div>
  );
};

export default MenuPage;
