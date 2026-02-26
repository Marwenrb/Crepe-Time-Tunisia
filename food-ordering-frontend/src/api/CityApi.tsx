import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_CITY = "Nabeul";

export const useCitySearch = () => {
  const [cities, setCities] = useState<string[]>([DEFAULT_CITY]);
  const [filteredCities, setFilteredCities] = useState<string[]>([DEFAULT_CITY]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/restaurant/cities/all`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedCities = data.cities?.length ? data.cities : [DEFAULT_CITY];
        setCities(fetchedCities);
        setFilteredCities(fetchedCities);
        setLoading(false);
      })
      .catch(() => {
        setCities([DEFAULT_CITY]);
        setFilteredCities([DEFAULT_CITY]);
        setError(null);
        setLoading(false);
      });
  }, []);

  const filterCities = (input: string) => {
    if (!input) {
      setFilteredCities(cities);
      return;
    }
    setFilteredCities(
      cities.filter((city) => city.toLowerCase().includes(input.toLowerCase()))
    );
  };

  return { cities, filteredCities, filterCities, loading, error };
};
