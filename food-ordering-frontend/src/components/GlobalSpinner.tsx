import { Loader2 } from "lucide-react";

const GlobalSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
      <Loader2 className="h-16 w-16 text-crepe-purple animate-spin mb-6" />
      <span className="text-2xl font-bold text-crepe-purple animate-pulse">
        Préparation en cours...
      </span>
    </div>
  );
};

export default GlobalSpinner;
