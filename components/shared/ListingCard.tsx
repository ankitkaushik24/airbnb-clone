import { toggleFavorite } from "@/actions";
import worldCountries from "@/lib/getCountries";
import Image from "next/image";
import Link from "next/link";
import SubmitFormBtn, { PendingBtn, SubmitBtn } from "./SubmitFormBtn";
import { Heart } from "lucide-react";

interface IListingCardProps {
  imagePath: string;
  description: string;
  location: string;
  price: number;
  userId: string | undefined;
  isFavorite?: boolean;
  favoriteId?: string;
  homeId: string;
  pathName: string;
}

const ToggleFavoriteBtn = ({ isFavorite }: { isFavorite: boolean }) => {
  return (
    <SubmitFormBtn
      pendingBtn={
        <PendingBtn
          variant="outline"
          size="icon"
          className="bg-primary-foreground"
        />
      }
      submitBtn={
        <SubmitBtn
          variant="outline"
          size="icon"
          className="bg-primary-foreground"
        >
          {isFavorite ? (
            <Heart className="w-4 h-4 text-primary" fill="#E21C49" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
        </SubmitBtn>
      }
    />
  );
};

export function ListingCard({
  description,
  imagePath,
  location,
  price,
  userId,
  favoriteId,
  homeId,
  isFavorite = false,
  pathName,
}: IListingCardProps) {
  const { countryByValue } = worldCountries;
  const country = countryByValue(location);

  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <Image
          src={`https://josdibecllgrettfgfhn.supabase.co/storage/v1/object/public/images/${imagePath}`}
          alt="Image of House"
          fill
          className="rounded-lg h-full object-cover"
        />

        {userId && (
          <div className="z-10 absolute top-2 right-2">
            <form action={toggleFavorite}>
              <input type="hidden" name="homeId" value={homeId} />
              {isFavorite && (
                <input type="hidden" name="favoriteId" value={favoriteId} />
              )}
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="pathName" value={pathName} />
              <ToggleFavoriteBtn isFavorite={isFavorite} />
            </form>
          </div>
        )}
      </div>

      <Link href={`/home/${homeId}`} className="mt-2">
        <h3 className="font-medium text-base">
          {country?.flag} {country?.label} / {country?.region}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">${price}</span> Night
        </p>
      </Link>
    </div>
  );
}
