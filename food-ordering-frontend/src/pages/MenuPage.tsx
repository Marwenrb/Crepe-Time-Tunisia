import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MenuPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/restaurant/default/Nabeul`
        );
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
          Vérifiez que Supabase est configuré et que le schéma SQL a été exécuté.
          <span className="block mt-2">Puis :</span>
          <code className="bg-muted px-2 py-1 rounded block mt-2">
            cd food-ordering-backend
          </code>
          <code className="bg-muted px-2 py-1 rounded block mt-1">
            npm run seed
          </code>
          <code className="bg-muted px-2 py-1 rounded block mt-1">
            npm run dev
          </code>
          <span className="block mt-3 text-xs">
            Voir GUIDE_DEMARRAGE.md pour la configuration Supabase.
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
