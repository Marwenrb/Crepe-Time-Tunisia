import { useLocation, Link } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { useAppContext } from "@/contexts/AppContext";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const { isLoggedIn } = useAppContext();
  const { pathname } = useLocation();
  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  if (!isLoggedIn) {
    return (
      <Button asChild className="bg-crepe-purple flex-1">
        <Link to="/sign-in" state={{ from: { pathname } }}>
          Connectez-vous pour commander
        </Link>
      </Button>
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
