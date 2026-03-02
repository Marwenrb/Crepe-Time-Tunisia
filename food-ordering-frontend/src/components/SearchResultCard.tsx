import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import { Banknote, Clock, Dot } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};

const SearchResultCard = ({ restaurant }: Props) => {
  return (
    <Link
      to={`/detail/${restaurant._id}`}
      className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr] lg:grid-cols-[2fr_3fr] gap-4 sm:gap-5 p-4 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 bg-card sm:bg-transparent hover:shadow-lg sm:hover:shadow-none transition-all duration-300 group"
    >
      <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      <div className="min-w-0">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight mb-2 group-hover:text-crepe-purple transition-colors truncate">
          {restaurant.restaurantName}
        </h3>
        <div id="card-content" className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
          <div className="flex flex-row flex-wrap">
            {restaurant.cuisines.map((item, index) => (
              <span className="flex" key={item + index}>
                <span>{item}</span>
                {index < restaurant.cuisines.length - 1 && <Dot />}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-1 text-green-600">
              <Clock className="text-green-600" />
              {restaurant.estimatedDeliveryTime} mins
            </div>
            <div className="flex items-center gap-1">
              <Banknote />
              Livraison dès {(restaurant.deliveryPrice / 100).toFixed(2)} TND
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
