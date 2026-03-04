import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, HAS_WORKING_API_URL } from "@/lib/runtime-config";

const MenuPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!HAS_WORKING_API_URL) {
      setError(true);
      return;
    }

    const fetchAndRedirect = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/restaurant/default/Nabeul`);
        if (!res.ok) throw new Error("No restaurant found");
        const restaurant = await res.json();
        navigate(`/detail/${restaurant._id}`, { replace: true });
      } catch {
        setError(true);
      }
    };

    fetchAndRedirect();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-6 text-center">
        <span className="text-lg font-semibold text-gray-700">
          Impossible de charger le menu.
        </span>
        <span className="text-sm text-muted-foreground max-w-md">
          Verifiez la configuration backend et Supabase.
          <span className="block mt-2">Puis :</span>
          <code className="bg-muted px-2 py-1 rounded block mt-2">
            Deployer le backend (Render, Railway, VPS)
          </code>
          <code className="bg-muted px-2 py-1 rounded block mt-1">
            VITE_API_BASE_URL=https://votre-backend
          </code>
          <code className="bg-muted px-2 py-1 rounded block mt-2">
            cd food-ordering-backend
          </code>
          <code className="bg-muted px-2 py-1 rounded block mt-1">
            npm run seed
          </code>
          <span className="block mt-3 text-xs">
            Voir GUIDE_DEMARRAGE.md pour la configuration complete.
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
