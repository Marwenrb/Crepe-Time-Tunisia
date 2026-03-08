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
          <button
            disabled={disabled}
            type="button"
            className="relative flex items-center justify-center flex-1 px-4 py-2 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/70 focus-visible:ring-offset-1 focus-visible:ring-offset-crepe-purple transition-shadow text-sm font-bold tracking-wide whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgb(247, 224, 124) 0%, rgb(229, 199, 107) 20%, rgb(212, 175, 55) 50%, rgb(194, 148, 14) 80%, rgb(184, 144, 31) 100%)",
              color: "rgb(15, 10, 31)",
              boxShadow: "rgba(212, 175, 55, 0.3) 0px 0px 0px 1px, rgba(212, 175, 55, 0.35) 0px 3px 12px, rgba(212, 175, 55, 0.12) 0px 6px 24px, rgba(255, 255, 255, 0.38) 0px 1px 0px inset, rgba(0, 0, 0, 0.24) 0px -1px 0px inset",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[40%] rounded-full pointer-events-none"
              style={{ background: "linear-gradient(rgba(255, 255, 255, 0.28) 0%, transparent 100%)" }}
            />
            <span className="relative z-10 flex items-center gap-1">
              <span className="font-bold">Commander en tant qu&apos;invité</span>
            </span>
          </button>
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
