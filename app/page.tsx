import CategoryFilterItems from "@/components/shared/CategoryFilterItems";
import { ListingCard } from "@/components/shared/ListingCard";
import { NoItems } from "@/components/shared/NoItems";
import { SkeltonCard } from "@/components/shared/SkeletonCard";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore } from "next/cache";
import Image from "next/image";
import { Suspense } from "react";

interface ISearchParams {
  filter?: string;
  country?: string;
  guest?: string;
  room?: string;
  bathroom?: string;
}

async function getHomes({
  searchParams,
  userId,
}: {
  userId: string | undefined;
  searchParams?: ISearchParams;
}) {
  unstable_noStore();
  const homes = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedLoaction: true,
      addedDescription: true,
      categoryName: searchParams?.filter,
      country: searchParams?.country,
      guests: searchParams?.guest,
      bedrooms: searchParams?.room,
      bathrooms: searchParams?.bathroom,
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      country: true,
      Favorite: {
        where: {
          userId: userId ?? undefined,
        },
      },
    },
  });

  return homes;
}

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
    </div>
  );
}

async function ShowItems({ searchParams }: { searchParams?: ISearchParams }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const homes = await getHomes({
    searchParams: searchParams,
    userId: user?.id,
  });

  if (homes.length === 0) {
    return (
      <NoItems
        description="Please check a other category or create your own listing!"
        title="Sorry no listings found for this category..."
      />
    );
  }
  return (
    <>
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {homes.map((item) => (
          <ListingCard
            key={item.id}
            description={item.description as string}
            imagePath={item.photo as string}
            location={item.country as string}
            price={item.price as number}
            userId={user?.id}
            favoriteId={item.Favorite[0]?.id}
            isFavorite={item.Favorite.length > 0}
            homeId={item.id}
            pathName="/"
          />
        ))}
      </div>
    </>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams?: ISearchParams;
}) {
  return (
    <main className="container mx-auto px-5 lg:px-10">
      <CategoryFilterItems />

      <Suspense key={searchParams?.filter} fallback={<SkeletonLoading />}>
        <ShowItems searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
