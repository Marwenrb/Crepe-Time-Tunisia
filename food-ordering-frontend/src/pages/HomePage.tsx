import SearchBar, { SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (formValues: SearchForm) => {
    const cityParam =
      formValues.city && formValues.city.trim() !== ""
        ? formValues.city
        : "Nabeul";
    navigate({
      pathname: `/search/${cityParam}`,
      search: formValues.searchQuery
        ? `?searchQuery=${encodeURIComponent(formValues.searchQuery)}`
        : undefined,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-12">
        <div className="relative z-[9999] md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
          <h1 className="text-5xl font-bold tracking-tight text-crepe-purple">
            Découvrez Nos Crêpes Artisanales
          </h1>
          <span className="text-xl">
            Crêperie premium — Livraison à domicile à Nabeul
          </span>
          <div className="flex flex-row gap-3 items-center justify-center">
            <div className="w-full">
              <SearchBar
                placeHolder="Rechercher une crêpe..."
                onSubmit={handleSearchSubmit}
                city="Nabeul"
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <img
            src="/hero.png"
            alt="Crêpe Time — Crêpes artisanales"
            className="rounded-lg shadow-lg"
            loading="lazy"
          />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="font-bold text-3xl tracking-tighter">
              Commandez en Toute Simplicité
            </span>
            <span>
              Contactez-nous sur WhatsApp pour une commande rapide et personnalisée.
              Livraison à domicile ou retrait en boutique — c'est vous qui choisissez !
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
