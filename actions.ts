"use server";

import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { supabase } from "./lib/supabase";
import { revalidatePath } from "next/cache";

export const createOrFindHome = async (userId: string) => {
  const redirectToCategory = (homeId: string) =>
    redirect(`/home/${homeId}/create/category`);
  const redirectToDescription = (homeId: string) =>
    redirect(`/home/${homeId}/create/description`);
  const redirectToLocation = (homeId: string) =>
    redirect(`/home/${homeId}/create/address`);
  const createHome = async () => {
    const home = await prisma.home.create({
      data: {
        userId,
      },
    });
    return home;
  };

  let home = await prisma.home.findFirst({
    where: {
      userId,
    },
  });

  if (home === null) {
    home = await createHome();
    return redirectToCategory(home.id);
  } else if (
    !home.addedCategory &&
    !home.addedDescription &&
    !home.addedLoaction
  ) {
    return redirectToCategory(home.id);
  } else if (home.addedCategory && !home.addedDescription) {
    return redirectToDescription(home.id);
  } else if (
    home.addedCategory &&
    home.addedDescription &&
    !home.addedLoaction
  ) {
    return redirectToLocation(home.id);
  } else if (
    home.addedCategory &&
    home.addedDescription &&
    home.addedLoaction
  ) {
    home = await createHome();

    return redirectToCategory(home.id);
  }

  return redirectToCategory(home.id);
};

export const updateHomeCategory = async (formData: FormData) => {
  const categoryName = formData.get("categoryName") as string;
  const homeId = formData.get("homeId") as string;

  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      categoryName: categoryName,
      addedCategory: true,
    },
  });

  return redirect(`/home/${homeId}/create/description`);
};

export const updateHomeDescription = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price");
  const imageFile = formData.get("image") as File;
  const homeId = formData.get("homeId") as string;

  const guests = formData.get("guest") as string;
  const bedrooms = formData.get("room") as string;
  const bathrooms = formData.get("bathroom") as string;

  const { data: imageData } = await supabase.storage
    .from("images")
    .upload(`${imageFile.name}-${Date.now()}`, imageFile, {
      cacheControl: "120",
      contentType: imageFile.type,
    })
    .then((d) => {
      console.log("uploaded", d.data);
      return d;
    })
    .catch((e) => {
      console.error("Failed to upload img");
      return e;
    });

  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      title,
      description,
      price: Number(price),
      bedrooms,
      bathrooms,
      guests,
      photo: imageData?.path,
      addedDescription: true,
    },
  });

  return redirect(`/home/${homeId}/create/address`);
};

export const updateHomeLocation = async (formData: FormData) => {
  const homeId = formData.get("homeId") as string;
  const country = formData.get("countryValue") as string;

  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      country,
      addedLoaction: true,
    },
  });

  return redirect("/");
};

export const toggleFavorite = async (formData: FormData) => {
  const favoriteId = formData.get("favoriteId");
  const homeId = formData.get("homeId") as string;
  const userId = formData.get("userId") as string;
  const pathName = formData.get("pathName") as string;

  if (favoriteId) {
    console.log({ favoriteId });
    await prisma.favorite.delete({
      where: {
        id: favoriteId as string,
        userId: userId,
      },
    });
  } else {
    await prisma.favorite.create({
      data: {
        homeId: homeId,
        userId: userId,
      },
    });
  }

  revalidatePath(pathName);
};

export const createReservation = async (formData: FormData) => {
  await prisma.reservation.create({
    data: {
      homeId: formData.get("homeId") as string,
      userId: formData.get("userId") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    },
  });

  return redirect("/");
};
