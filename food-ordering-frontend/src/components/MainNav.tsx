import UsernameMenu from "./UsernameMenu";
import { Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

const NAV_AUTH_WIDTH = "min-w-[120px]";

const KEYFRAMES = `
  @keyframes mn-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes mn-glow-breathe {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(212,175,55,0.12)) drop-shadow(0 0 24px rgba(212,175,55,0.06)); }
    50%      { filter: drop-shadow(0 0 16px rgba(212,175,55,0.22)) drop-shadow(0 0 36px rgba(212,175,55,0.1)); }
  }
  .mn-link {
    position: relative;
    font-weight: 600;
    color: rgba(76,29,149,0.9);
    transition: color 0.3s ease, text-shadow 0.3s ease;
    text-decoration: none;
  }
  .mn-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #D4AF37, #EDD060, #D4AF37);
    border-radius: 1px;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 0 8px rgba(212,175,55,0.5), 0 0 16px rgba(212,175,55,0.2);
    will-change: transform;
  }
  .mn-link:hover {
    color: #D4AF37;
    text-shadow: 0 0 14px rgba(212,175,55,0.35);
  }
  .mn-link:hover::after {
    transform: scaleX(1);
  }
  .mn-link:focus-visible {
    outline: 2px solid #D4AF37;
    outline-offset: 4px;
    border-radius: 2px;
  }
  .mn-connexion-wrap {
    position: relative;
    display: inline-flex;
    border-radius: 0.5rem;
    overflow: hidden;
    padding: 1.5px;
    animation: mn-glow-breathe 3.5s ease-in-out infinite;
    text-decoration: none;
  }
  .mn-connexion-wrap:focus-visible {
    outline: 2px solid #D4AF37;
    outline-offset: 3px;
    border-radius: 0.5rem;
  }
  .mn-connexion-inner {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(0.5rem - 1.5px);
    background: rgba(255,255,255,0.97);
    padding: 8px 20px;
    font-weight: 700;
    font-size: 0.875rem;
    color: #4C1D95;
    transition: color 0.3s ease, text-shadow 0.3s ease, background 0.3s ease;
  }
  .mn-connexion-wrap:hover .mn-connexion-inner {
    color: #D4AF37;
    background: rgba(255,255,255,1);
    text-shadow: 0 0 12px rgba(212,175,55,0.3);
  }
`;

const MainNav = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <>
      <style>{KEYFRAMES}</style>
      <nav className="flex items-center gap-6 lg:gap-8">
        <Link to="/menu" className="mn-link">Menu</Link>
        <Link to="/order-status" className="mn-link">Suivi de commande</Link>

        <div className={`flex items-center justify-end ${NAV_AUTH_WIDTH}`}>
          {isLoggedIn ? (
            <UsernameMenu />
          ) : (
            <Link to="/sign-in" className="mn-connexion-wrap">
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-150%",
                  background:
                    "conic-gradient(from 0deg, #D4AF37, transparent 20%, #7C3AED 40%, transparent 60%, #EDD060 80%, #D4AF37)",
                  animation: "mn-rotate-border 4s linear infinite",
                  willChange: "transform",
                }}
              />
              <span className="mn-connexion-inner">Connexion</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default MainNav;
