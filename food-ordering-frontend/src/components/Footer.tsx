import { Phone, MessageCircle, Instagram, Facebook, MapPin } from "lucide-react";

const CONTACT = {
  phone: "+216 XX XXX XXX",
  whatsapp: "+216XXXXXXXX",
  instagram: "crepetime_tunisia",
  facebook: "crepetimetunisia",
  address: "Nabeul, Tunisia",
};

const Footer = () => {
  return (
    <div className="bg-crepe-purple py-10">
      <div className="container mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Crêpe Time"
              className="h-10 w-10 rounded-full object-cover brightness-0 invert"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl text-white font-bold tracking-tight leading-tight">
                Crêpe Time Tunisia
              </span>
              <span className="text-xs text-crepe-gold tracking-widest uppercase leading-tight">
                The Sweetest Escape
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Contactez-nous
            </span>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-white/80 hover:text-crepe-gold transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              {CONTACT.phone}
            </a>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-crepe-gold transition-colors text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <span className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="h-4 w-4" />
              {CONTACT.address}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Suivez-nous
            </span>
            <a
              href={`https://instagram.com/${CONTACT.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-crepe-gold transition-colors text-sm"
            >
              <Instagram className="h-4 w-4" />
              @{CONTACT.instagram}
            </a>
            <a
              href={`https://facebook.com/${CONTACT.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-crepe-gold transition-colors text-sm"
            >
              <Facebook className="h-4 w-4" />
              Crêpe Time Tunisia
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Légal
            </span>
            <span className="text-white/80 text-sm hover:text-crepe-gold cursor-pointer transition-colors">
              Politique de confidentialité
            </span>
            <span className="text-white/80 text-sm hover:text-crepe-gold cursor-pointer transition-colors">
              Conditions d'utilisation
            </span>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 text-center">
          <span className="text-white/60 text-xs">
            © {new Date().getFullYear()} Crêpe Time Tunisia — Conçu avec passion par{" "}
            <a
              href="https://marwenrabai.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crepe-gold hover:underline"
            >
              Marouan Rabai
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
