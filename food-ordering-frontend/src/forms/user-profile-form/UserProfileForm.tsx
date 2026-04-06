import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/types";
import { useEffect, useRef, useState, useCallback } from "react";
import { useUploadUserPhoto } from "@/api/MyUserApi";
import {
  Camera,
  Loader2,
  Save,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Home,
  Sparkles,
} from "lucide-react";

const formSchema = z.object({
  email: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(8, "Le numÃ©ro de tÃ©lÃ©phone est requis (min. 8 chiffres)"),
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

/* â”€â”€ Particles config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PARTICLES = [
  { top: "12%", left: "8%",   delay: "0s",   size: "3px", anim: "ct-pulse 3s ease-in-out infinite" },
  { top: "75%", left: "6%",   delay: "1.4s", size: "2px", anim: "ct-float 4.5s ease-in-out infinite" },
  { top: "30%", right: "8%",  delay: "0.7s", size: "4px", anim: "ct-pulse 2.8s ease-in-out infinite" },
  { top: "82%", right: "14%", delay: "2s",   size: "2px", anim: "ct-float 5s ease-in-out infinite" },
  { top: "52%", left: "50%",  delay: "2.6s", size: "3px", anim: "ct-pulse 3.2s ease-in-out infinite" },
  { top: "20%", right: "22%", delay: "0.3s", size: "2px", anim: "ct-float 4s ease-in-out infinite" },
  { top: "60%", left: "30%",  delay: "1.8s", size: "3px", anim: "ct-pulse 2.5s ease-in-out infinite" },
  { top: "90%", left: "60%",  delay: "3.2s", size: "2px", anim: "ct-float 5.5s ease-in-out infinite" },
];

/* â”€â”€ Section divider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SectionDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 pt-1 pb-0.5">
    <div
      className="flex-1 h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" }}
    />
    <span className="text-[9px] text-[#D4AF37]/45 tracking-[0.28em] uppercase font-medium select-none">
      {label}
    </span>
    <div
      className="flex-1 h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" }}
    />
  </div>
);

/* â”€â”€ UIverse inset-shadow input wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FieldWrapper = ({
  icon,
  children,
  disabled = false,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <div
    className={`flex items-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] transition-shadow duration-200 ${
      disabled
        ? "shadow-[inset_2px_5px_10px_rgb(5,5,5)] opacity-60"
        : "shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.35),0_0_12px_rgba(212,175,55,0.12)]"
    }`}
  >
    {icon}
    {children}
  </div>
);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentUser.imageUrl || localStorage.getItem("user_image") || null
  );
  const [imgError, setImgError] = useState(false);

  const hue = hashHue(currentUser.name || currentUser.email || "ct");
  const initials = getInitials(currentUser.name, currentUser.email);

  /* Profile completion (live) */
  const watched = form.watch(["name", "phone", "addressLine1", "city", "country"]);
  const completionPct = Math.round(
    (watched.filter((v) => typeof v === "string" && v.trim().length > 0).length / watched.length) * 100
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setImgError(false);
      try {
        const result = await uploadPhoto(file);
        if (result?.imageUrl) setPreviewUrl(result.imageUrl);
      } catch {
        // preview already set; toast shown by hook
      }
      e.target.value = "";
    },
    [uploadPhoto]
  );

  const showPhoto = previewUrl && !imgError;

  return (
    <div
      className="relative min-h-screen w-full flex items-start justify-center py-10 px-4"
      style={{ background: "linear-gradient(160deg, #0F0A1F 0%, #1a0d3a 40%, #0F0A1F 100%)" }}
    >
      {/* â”€â”€ Gold accent line â€” top â”€â”€ */}
      <div className="absolute top-0 inset-x-0 z-10" aria-hidden="true">
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.08) 20%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.08) 80%, transparent 90%)",
          }}
        />
      </div>

      {/* â”€â”€ Ambient orbs â”€â”€ */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 w-[520px] h-[520px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.8) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-[380px] h-[380px] rounded-full opacity-[0.08] blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 65%)" }}
      />

      {/* â”€â”€ Noise texture â”€â”€ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* â”€â”€ Floating particles â”€â”€ */}
      <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: "left" in p ? (p as { left: string }).left : undefined,
              right: "right" in p ? (p as { right: string }).right : undefined,
              width: p.size,
              height: p.size,
              background: "rgba(212,175,55,0.6)",
              animation: p.anim,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* â”€â”€ Main content â”€â”€ */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-white/35 text-sm mt-1 tracking-wide">GÃ©rez vos informations personnelles</p>
        </div>

        {/* â”€â”€ Avatar section â”€â”€ */}
        <div className="flex flex-col items-center mb-8 group">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="relative w-28 h-28 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50"
              aria-label="Changer la photo de profil"
            >
              {/* Animated ring */}
              <div
                className="absolute -inset-1.5 rounded-full opacity-60"
                style={{
                  background: "conic-gradient(from 0deg, #D4AF37, #4C1D95, #D4AF37)",
                  animation: "ct-spin 6s linear infinite",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute -inset-0.5 rounded-full"
                style={{ background: "#0F0A1F" }}
                aria-hidden="true"
              />

              {showPhoto ? (
                <img
                  src={previewUrl!}
                  alt={currentUser.name || "Profile"}
                  className="relative w-28 h-28 rounded-full object-cover"
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span
                  className="relative w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                  style={{ background: `hsl(${hue},50%,26%)` }}
                >
                  {initials}
                </span>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                {isUploading ? (
                  <Loader2 className="w-7 h-7 text-[#D4AF37] animate-spin" />
                ) : (
                  <Camera className="w-7 h-7 text-[#D4AF37]" />
                )}
              </div>
            </button>

            {/* Camera badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0F0A1F] hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed z-10"
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

          <p className="text-white/30 text-xs mt-3 tracking-wider">Cliquez pour changer votre photo</p>

          {/* Completion bar */}
          <div className="mt-3 w-52 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-white/25 tracking-widest uppercase">ComplÃ©tion du profil</span>
              <span
                className="text-[9px] font-semibold"
                style={{ color: completionPct === 100 ? "#22c55e" : "#D4AF37" }}
              >
                {completionPct}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPct}%`,
                  background:
                    completionPct === 100
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : "linear-gradient(90deg, #D4AF37, #E5C76B)",
                }}
              />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
            aria-hidden="true"
          />
        </div>

        {/* â”€â”€ Form card â€” UIverse gradient border â”€â”€ */}
        <div
          className="w-full rounded-[22px] p-[2px] transition-all duration-300 hover:shadow-[0_0_40px_2px_rgba(212,175,55,0.2)]"
          style={{ background: "linear-gradient(163deg, #D4AF37 0%, #4C1D95 100%)" }}
        >
          <div className="rounded-none transition-all duration-200 hover:rounded-[20px]">
            <div
              className="rounded-[20px] px-7 py-7"
              style={{ background: "#0F0A1F" }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">

                  {/* â”€â”€ IdentitÃ© â”€â”€ */}
                  <SectionDivider label="IdentitÃ©" />

                  {/* Email â€” read-only */}
                  <div className="ct-field-1">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="text-[9px] text-[#D4AF37]/45 tracking-[0.25em] uppercase font-medium flex items-center gap-1.5 mb-1.5">
                            <Mail className="w-3 h-3" /> Email
                          </div>
                          <FormControl>
                            <FieldWrapper icon={<UserIcon className="h-[1.3em] w-[1.3em] text-[#D4AF37]/30 shrink-0" />} disabled>
                              <input
                                {...field}
                                value={field.value ?? ""}
                                disabled
                                className="bg-transparent border-none outline-none w-full text-white/30 text-sm cursor-not-allowed"
                              />
                            </FieldWrapper>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Name */}
                  <div className="ct-field-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="text-[9px] text-[#D4AF37]/45 tracking-[0.25em] uppercase font-medium flex items-center gap-1.5 mb-1.5">
                            <UserIcon className="w-3 h-3" /> Nom complet
                          </div>
                          <FormControl>
                            <FieldWrapper icon={<UserIcon className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />}>
                              <input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="Votre nom"
                                className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                              />
                            </FieldWrapper>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs mt-1 ml-3" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* â”€â”€ Contact â”€â”€ */}
                  <SectionDivider label="Contact" />

                  {/* Phone */}
                  <div className="ct-field-3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <div className="text-[9px] text-[#D4AF37]/45 tracking-[0.25em] uppercase font-medium flex items-center gap-1.5 mb-1.5">
                            <Phone className="w-3 h-3" /> TÃ©lÃ©phone / WhatsApp
                          </div>
                          <FormControl>
                            <FieldWrapper icon={<Phone className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />}>
                              <input
                                {...field}
                                value={field.value ?? ""}
                                type="tel"
                                placeholder="+216 XX XXX XXX"
                                className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                              />
                            </FieldWrapper>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs mt-1 ml-3" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* â”€â”€ Adresse â”€â”€ */}
                  <SectionDivider label="Adresse de livraison" />

                  {/* Address */}
                  <div className="ct-field-4">
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <div className="text-[9px] text-[#D4AF37]/45 tracking-[0.25em] uppercase font-medium flex items-center gap-1.5 mb-1.5">
                            <Home className="w-3 h-3" /> Adresse
                          </div>
                          <FormControl>
                            <FieldWrapper icon={<Home className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />}>
                              <input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="Rue, numÃ©ro..."
                                className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                              />
                            </FieldWrapper>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs mt-1 ml-3" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* City + Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="ct-field-5">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <div className="text-[9px] text-[#D4AF37]/45 tracking-[0.25em] uppercase font-medium flex items-center gap-1.5 mb-1.5">
                              <MapPin className="w-3 h-3" /> Ville
                            </div>
                            <FormControl>
                              <FieldWrapper icon={<MapPin className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />}>
                                <input
                                  {...field}
                                  value={field.value ?? ""}
                                  placeholder="Nabeul..."
                                  className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                                />
                              </FieldWrapper>
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs mt-1 ml-3" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="ct-field-6">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <div className="text-[9px] text-[#D4AF37]/45 tracking-[0.25em] uppercase font-medium flex items-center gap-1.5 mb-1.5">
                              <Globe className="w-3 h-3" /> Pays
                            </div>
                            <FormControl>
                              <FieldWrapper icon={<Globe className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />}>
                                <input
                                  {...field}
                                  value={field.value ?? ""}
                                  placeholder="Tunisie"
                                  className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                                />
                              </FieldWrapper>
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs mt-1 ml-3" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="ct-field-7 pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="ct-btn-shimmer w-full h-12 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                        color: "#0F0A1F",
                        boxShadow: "0 4px 20px rgba(212,175,55,0.3), 0 0 0 1px rgba(212,175,55,0.15)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sauvegardeâ€¦
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {buttonText}
                        </>
                      )}
                    </button>

                    {/* Trust badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]/30" />
                      <span className="text-[9px] text-white/20 tracking-widest uppercase">
                        DonnÃ©es protÃ©gÃ©es â€” Sauvegarde sÃ©curisÃ©e
                      </span>
                      <Sparkles className="w-3 h-3 text-[#D4AF37]/30" />
                    </div>
                  </div>

                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
