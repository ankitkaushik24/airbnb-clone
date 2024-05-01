import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const GET = async () => {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    throw new Error("User not found!");
  }

  let userInDb = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userInDb) {
    userInDb = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        profileImage: user.picture,
      },
    });
  }

  console.log(userInDb);

  return NextResponse.redirect(process.env.KINDE_SITE_URL ?? "");
};
