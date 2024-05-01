import { createReservation } from "@/actions";
import { CaegoryShowcase } from "@/components/shared/CategoryShowcase";
import SelectDateRange from "@/components/shared/SelectDateRange";
import SubmitFormBtn, {
  PendingBtn,
  SubmitBtn,
} from "@/components/shared/SubmitFormBtn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/db";
import worldCountries from "@/lib/getCountries";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo } from "react";

const HomeMap = (props: { locationValue: string }) => {
  "use client";
  const DynamicMap = useMemo(
    () =>
      dynamic(() => import("@/components/shared/Map"), {
        ssr: false,
        loading: () => <Skeleton className="h-[50vh] w-full" />,
      }),
    []
  );

  return <DynamicMap {...props} />;
};

const getMyHome = (homeId: string) => {
  return prisma.home.findUnique({
    where: {
      id: homeId,
    },
    include: {
      Favorite: true,
      User: true,
      reservations: true,
    },
  });
};

const MyHome: FC<{ params: { homeId: string } }> = async ({
  params: { homeId },
}) => {
  const { getUser } = getKindeServerSession();
  const [data, user] = await Promise.all([getMyHome(homeId), getUser()]);

  if (!data) {
    return "Not found!";
  }

  const { countryByValue } = worldCountries;
  const country = countryByValue(data.country!);
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>
      <div className="relative h-[550px]">
        <Image
          alt="Image of Home"
          src={`https://josdibecllgrettfgfhn.supabase.co/storage/v1/object/public/images/${data?.photo}`}
          fill
          className="rounded-lg h-full object-cover w-full"
        />
      </div>

      <div className="flex justify-between gap-x-24 mt-8">
        <div className="w-2/3">
          <h3 className="text-xl font-medium">
            {country?.flag} {country?.label} / {country?.region}
          </h3>
          <div className="flex gap-x-2 text-muted-foreground">
            <p>{data?.guests} Guests</p> * <p>{data?.bedrooms} Bedrooms</p> *{" "}
            {data?.bathrooms} Bathrooms
          </div>

          <div className="flex items-center mt-6">
            <Image
              src={
                data?.User?.profileImage ??
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="User Profile"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col ml-4">
              <h3 className="font-medium">Hosted by {data?.User?.firstName}</h3>
              <p className="text-sm text-muted-foreground">
                Host since {formatter.format(data?.User?.createdAt)}
              </p>
            </div>
          </div>

          <Separator className="my-7" />

          <CaegoryShowcase categoryName={data?.categoryName as string} />

          <Separator className="my-7" />

          <p className="text-muted-foreground">{data?.description}</p>

          <Separator className="my-7" />

          <HomeMap locationValue={country?.value!} />
        </div>

        <form action={createReservation}>
          <input type="hidden" name="homeId" value={data.id} />
          <input type="hidden" name="userId" value={user?.id} />

          <SelectDateRange occupiedIntervals={data.reservations} />

          {user?.id ? (
            <SubmitFormBtn
              submitBtn={
                <SubmitBtn className="w-full">Make a Reservation</SubmitBtn>
              }
              pendingBtn={
                <PendingBtn className="w-full">Please wait...</PendingBtn>
              }
            />
          ) : (
            <Button className="w-full" asChild>
              <Link href="/api/auth/login">Make a Reservation</Link>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MyHome;
