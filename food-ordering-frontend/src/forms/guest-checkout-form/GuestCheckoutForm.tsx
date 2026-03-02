import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(8, "Le numéro de téléphone est requis (min. 8 chiffres)"),
  addressLine1: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
  email: z.string().optional(),
});

export type GuestFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (data: GuestFormData) => void;
  isLoading: boolean;
};

const GuestCheckoutForm = ({ onSave, isLoading }: Props) => {
  const form = useForm<GuestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      addressLine1: "",
      city: "Nabeul",
      country: "Tunisia",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4 bg-gray-50 rounded-lg md:p-10"
      >
        <div>
          <h2 className="text-2xl font-bold">Commander en tant qu&apos;invité</h2>
          <FormDescription>
            Entrez vos coordonnées pour la livraison. Pas besoin de créer un compte.
          </FormDescription>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet *</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" placeholder="Votre nom" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone / WhatsApp *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-white"
                  placeholder="+216 XX XXX XXX"
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse de livraison *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-white"
                  placeholder="Rue, numéro, quartier"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ville *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Pays *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optionnel)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className="bg-white"
                  type="email"
                  placeholder="email@exemple.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading ? (
          <LoadingButton />
        ) : (
          <Button type="submit" className="bg-crepe-purple w-full">
            Confirmer — Paiement à la livraison
          </Button>
        )}
      </form>
    </Form>
  );
};

export default GuestCheckoutForm;
