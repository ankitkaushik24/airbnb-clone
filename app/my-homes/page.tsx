import { ListingCard } from "@/components/shared/ListingCard";
import { NoItems } from "@/components/shared/NoItems";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const getMyHomes = (userId: string) => {
  return prisma.home.findMany({
    where: {
      userId,
    },
    include: {
      Favorite: true,
    },
    orderBy: {
      createdAT: "desc",
    },
  });
};

const MyHomesPage = async () => {
  unstable_noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const myHomes = await getMyHomes(user.id);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Homes</h2>

      {myHomes.length === 0 ? (
        <NoItems
          description="Please list a hoeme on airbnb so that you can see it right here"
          title="Your dont have any Homes listed"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {myHomes.map((item) => (
            <ListingCard
              key={item.id}
              imagePath={item.photo as string}
              homeId={item.id}
              price={item.price as number}
              description={item.description as string}
              location={item.country as string}
              userId={user.id}
              pathName="/my-homes"
              favoriteId={item.Favorite[0]?.id}
              isFavorite={item.Favorite.length > 0}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyHomesPage;
