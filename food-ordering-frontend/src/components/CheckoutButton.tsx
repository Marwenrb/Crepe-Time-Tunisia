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
          <Button disabled={disabled} className="bg-crepe-purple flex-1">
            Commander en tant qu&apos;invité
          </Button>
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
