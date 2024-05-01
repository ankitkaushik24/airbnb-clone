import { ListingCard } from "@/components/shared/ListingCard";
import { NoItems } from "@/components/shared/NoItems";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const getFavorites = (userId: string) => {
  return prisma.favorite.findMany({
    where: {
      userId,
    },
    select: {
      Home: {
        include: {
          Favorite: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });
};

const FavoritesPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  const myFavourites = await getFavorites(user.id);

  return (
    <section className="container mx-atuo px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Favorites</h2>

      {myFavourites.length === 0 ? (
        <NoItems
          title="Hey you dont have any favorites"
          description="Please add favorites to see them right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {myFavourites.map((item) => (
            <ListingCard
              key={item.Home?.id}
              description={item.Home?.description as string}
              location={item.Home?.country as string}
              pathName="/favorites"
              homeId={item.Home?.id as string}
              imagePath={item.Home?.photo as string}
              price={item.Home?.price as number}
              userId={user.id}
              favoriteId={item.Home?.Favorite[0].id as string}
              isFavorite={(item.Home?.Favorite.length as number) > 0}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
