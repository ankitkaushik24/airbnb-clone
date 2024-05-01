import { ListingCard } from "@/components/shared/ListingCard";
import { NoItems } from "@/components/shared/NoItems";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const getReservations = (userId: string) => {
  return prisma.reservation.findMany({
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

const ReservationsPage = async () => {
  unstable_noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  const myReservations = await getReservations(user.id);

  return (
    <section className="container mx-atuo px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Favorites</h2>

      {myReservations.length === 0 ? (
        <NoItems
          title="Hey you dont have any reservations yet"
          description="Please add a reservation to see them right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {myReservations.map((item) => (
            <ListingCard
              key={item.Home?.id}
              description={item.Home?.description as string}
              location={item.Home?.country as string}
              pathName="/favorites"
              homeId={item.Home?.id as string}
              imagePath={item.Home?.photo as string}
              price={item.Home?.price as number}
              userId={user.id}
              favoriteId={item.Home?.Favorite[0]?.id as string}
              isFavorite={(item.Home?.Favorite.length as number) > 0}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReservationsPage;
