import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import GuestCheckoutForm, {
  GuestFormData,
} from "@/forms/guest-checkout-form/GuestCheckoutForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { useAppContext } from "@/contexts/AppContext";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  onGuestCheckout?: (guestFormData: GuestFormData) => void;
  disabled: boolean;
  isLoading: boolean;
  isGuestLoading?: boolean;
};

const CheckoutButton = ({
  onCheckout,
  onGuestCheckout,
  disabled,
  isLoading,
  isGuestLoading = false,
}: Props) => {
  const { isLoggedIn } = useAppContext();
  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  if (!isLoggedIn) {
    if (!onGuestCheckout) {
      return (
        <Button disabled className="bg-crepe-purple flex-1">
          Connectez-vous pour commander
        </Button>
      );
    }
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="mt-3 flex justify-center w-full">
            <button
              disabled={disabled}
              type="button"
              className="guest-cta-btn group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full overflow-visible focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-crepe-purple text-sm font-bold tracking-wide whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
              style={{
                "--glow-color": "rgb(212, 175, 55)",
                "--glow-spread": "rgba(212, 175, 55, 0.45)",
                "--btn-bg": "rgb(26, 18, 51)",
                border: "0.12em solid var(--glow-color)",
                color: "var(--glow-color)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                backgroundColor: "var(--btn-bg)",
                boxShadow: [
                  "0 0 0.6em 0.15em var(--glow-color)",
                  "0 0 2.5em 0.6em var(--glow-spread)",
                  "inset 0 0 0.5em 0.1em var(--glow-color)",
                ].join(","),
                textShadow: "0 0 0.5em var(--glow-color)",
              } as React.CSSProperties}
            >
              {/* Floor reflection */}
              <span
                aria-hidden="true"
                className="absolute pointer-events-none left-0 w-full"
                style={{
                  top: "110%",
                  height: "70%",
                  background: "var(--glow-spread)",
                  filter: "blur(1.2em)",
                  opacity: 0.45,
                  transform: "perspective(1em) rotateX(35deg) scale(1,0.45)",
                  borderRadius: "50%",
                }}
              />
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="font-bold">Commander en tant qu&apos;invité</span>
              </span>
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
          <GuestCheckoutForm
            onSave={onGuestCheckout}
            isLoading={isGuestLoading}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-crepe-purple flex-1">
          Confirmer la commande
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <UserProfileForm
          currentUser={currentUser}
          onSave={onCheckout}
          isLoading={isGetUserLoading}
          title="Détails de livraison"
          buttonText="Confirmer — Paiement à la livraison"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
