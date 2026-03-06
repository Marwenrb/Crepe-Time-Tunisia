/**
 * MenuItem — thin wrapper that delegates to PremiumMenuCard.
 *
 * Kept as a stable import path so other code that may reference
 * this component does not break. All visual logic lives in PremiumMenuCard.
 */

import type { MenuItem as MenuItemType } from "../types";
import { PremiumMenuCard } from "./menu/PremiumMenuCard";

type Props = {
  menuItem: MenuItemType;
  addToCart: () => void;
  /** Position in the rendered list (drives stagger entrance animation) */
  index?: number;
  /** Number of this item currently in the cart */
  cartQuantity?: number;
  /** Called when the card body is clicked to open the detail modal */
  onCardClick?: () => void;
};

const MenuItem = ({
  menuItem,
  addToCart,
  index = 0,
  cartQuantity = 0,
  onCardClick = () => {},
}: Props) => {
  return (
    <PremiumMenuCard
      menuItem={menuItem}
      addToCart={addToCart}
      index={index}
      cartQuantity={cartQuantity}
      onCardClick={onCardClick}
    />
  );
};

export default MenuItem;
