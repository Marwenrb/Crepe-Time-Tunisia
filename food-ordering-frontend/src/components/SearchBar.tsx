import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import CityDropdown from "./CityDropdown";

const formSchema = z.object({
  city: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type SearchForm = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (formData: SearchForm) => void;
  placeHolder: string;
  onReset?: () => void;
  searchQuery?: string;
  city?: string;
};

const SearchBar = ({
  onSubmit,
  onReset,
  placeHolder,
  searchQuery,
  city,
}: Props) => {
  const [selectedCity, setSelectedCity] = useState(city || "");
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery,
      city: city || "",
    },
  });

  useEffect(() => {
    form.reset({ searchQuery, city: selectedCity });
  }, [form, searchQuery, selectedCity]);

  const handleReset = () => {
    form.reset({
      searchQuery: "",
      city: "",
    });
    setSelectedCity("");
    if (onReset) {
      onReset();
    }
  };

  const handleCityChange = (cityVal: string) => {
    setSelectedCity(cityVal);
    form.setValue("city", cityVal);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-2 rounded-xl sm:rounded-full p-2 sm:p-3 ${
          form.formState.errors.searchQuery ? "border-red-500" : "border-crepe-purple/20"
        }`}
      >
        <Search
          strokeWidth={2.5}
          size={24}
          className="text-crepe-purple shrink-0 hidden sm:block"
        />
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <CityDropdown value={selectedCity} onChange={handleCityChange} />
          <FormField
            control={form.control}
            name="searchQuery"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-0">
                <FormControl>
                  <Input
                    {...field}
                    className="border-none shadow-none text-base sm:text-xl focus-visible:ring-0 min-w-0"
                    placeholder={placeHolder}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 sm:gap-0 sm:flex-shrink-0">
          <Button
            onClick={handleReset}
            type="button"
            variant="outline"
            className="rounded-full flex-1 sm:flex-none text-sm"
          >
            Effacer
          </Button>
          <Button type="submit" className="rounded-full bg-crepe-purple flex-1 sm:flex-none text-sm">
            Rechercher
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchBar;
