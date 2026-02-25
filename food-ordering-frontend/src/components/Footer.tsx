const Footer = () => {
  return (
    <div className="bg-crepe-purple py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
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
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-white font-bold tracking-tight flex gap-4">
            <span>Politique de confidentialité</span>
            <span>Conditions d'utilisation</span>
          </span>
          <span className="text-white/60 text-xs">
            © {new Date().getFullYear()} Crêpe Time Tunisia — Conçu par{" "}
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
