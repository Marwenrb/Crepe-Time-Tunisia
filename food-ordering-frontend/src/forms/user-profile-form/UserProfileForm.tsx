import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { useEffect, useRef, useState, useCallback } from "react";
import { useUploadUserPhoto } from "@/api/MyUserApi";
import { Camera, Loader2, Save, User as UserIcon, Mail, Phone, MapPin, Globe, Home } from "lucide-react";

const formSchema = z.object({
  email: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(8, "Le numéro de téléphone est requis (min. 8 chiffres)"),
  addressLine1: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
  currentUser: User;
  onSave: (userProfileData: UserFormData) => void;
  isLoading: boolean;
  title?: string;
  buttonText?: string;
};

/** Returns initials (up to 2 chars) from a name or email */
function getInitials(name?: string, email?: string): string {
  const src = name || email || "?";
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function hashHue(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}

const UserProfileForm = ({
  onSave,
  isLoading,
  currentUser,
  title = "Mon Profil",
  buttonText = "Sauvegarder",
}: Props) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...currentUser, phone: currentUser.phone ?? "" },
  });

  useEffect(() => {
    form.reset({ ...currentUser, phone: currentUser.phone ?? "" });
  }, [currentUser, form]);

  const { uploadPhoto, isLoading: isUploading } = useUploadUserPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUser.imageUrl || localStorage.getItem("user_image") || null);
  const [imgError, setImgError] = useState(false);

  const hue = hashHue(currentUser.name || currentUser.email || "ct");
  const initials = getInitials(currentUser.name, currentUser.email);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Client-side preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setImgError(false);
    try {
      const result = await uploadPhoto(file);
      if (result?.imageUrl) setPreviewUrl(result.imageUrl);
    } catch {
      // preview already set; toast shown by hook
    }
    // reset input so same file can be re-selected
    e.target.value = "";
  }, [uploadPhoto]);

  const showPhoto = previewUrl && !imgError;

  return (
    <div
      className="relative min-h-screen w-full flex items-start justify-center py-10 px-4"
      style={{ background: "linear-gradient(160deg, #0F0A1F 0%, #1a0d3a 50%, #0F0A1F 100%)" }}
    >
      {/* Ambient orbs */}
      <div aria-hidden="true" className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.8) 0%, transparent 70%)" }} />
      <div aria-hidden="true" className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-8 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-white/40 text-sm mt-1 tracking-wide">Gérez vos informations personnelles</p>
        </div>

        {/* Avatar section */}
        <div className="flex flex-col items-center mb-8 group">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="relative w-28 h-28 rounded-full focus:outline-none focus:ring-2 focus:ring-crepe-gold/50"
              aria-label="Changer la photo de profil"
            >
              {showPhoto ? (
                <img
                  src={previewUrl!}
                  alt={currentUser.name || "Profile"}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-crepe-gold/30 ring-offset-2 ring-offset-[#0F0A1F]"
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span
                  className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white ring-4 ring-crepe-gold/30 ring-offset-2 ring-offset-[#0F0A1F]"
                  style={{ background: `hsl(${hue},50%,32%)` }}
                >
                  {initials}
                </span>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-7 h-7 text-crepe-gold animate-spin" />
                ) : (
                  <Camera className="w-7 h-7 text-crepe-gold" />
                )}
              </div>
            </button>

            {/* Badge button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0F0A1F] hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #D4AF37, #E5C76B)" }}
              aria-label="Changer la photo"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 text-[#0F0A1F] animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-[#0F0A1F]" />
              )}
            </button>
          </div>
          <p className="text-white/30 text-xs mt-3 tracking-wider">
            Cliquez pour changer votre photo
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
            aria-hidden="true"
          />
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-[1px]"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(76,29,149,0.3) 50%, rgba(212,175,55,0.1) 100%)" }}
        >
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: "rgba(15,10,31,0.92)", backdropFilter: "blur(20px)" }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSave)} className="space-y-5">

                {/* Email — read-only */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/[0.04] border border-white/[0.07]">
                          <UserIcon className="w-4 h-4 text-white/20 shrink-0" />
                          <input
                            {...field}
                            value={field.value ?? ""}
                            disabled
                            className="bg-transparent border-none outline-none w-full text-white/40 text-sm cursor-not-allowed"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5" /> Nom complet
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Votre nom"
                          className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:border-crepe-gold/50 focus:ring-crepe-gold/20 rounded-xl h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> Téléphone / WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="tel"
                          placeholder="+216 XX XXX XXX"
                          className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:border-crepe-gold/50 focus:ring-crepe-gold/20 rounded-xl h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Home className="w-3.5 h-3.5" /> Adresse
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Rue, numéro..."
                          className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:border-crepe-gold/50 focus:ring-crepe-gold/20 rounded-xl h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* City + Country row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> Ville
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Nabeul..."
                            className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:border-crepe-gold/50 focus:ring-crepe-gold/20 rounded-xl h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5" /> Pays
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Tunisie"
                            className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:border-crepe-gold/50 focus:ring-crepe-gold/20 rounded-xl h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                      color: "#0F0A1F",
                      boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sauvegarde…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {buttonText}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
