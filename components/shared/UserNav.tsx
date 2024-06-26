import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { createOrFindHome } from "@/actions";
import { FC } from "react";
import { unstable_noStore } from "next/cache";

const LoggedInMenuContent: FC<{ userId: string }> = ({ userId }) => {
  const createOrFindHomeWithUserId = createOrFindHome.bind(null, userId);
  return (
    <>
      <DropdownMenuItem>
        <form action={createOrFindHomeWithUserId} className="w-full">
          <button type="submit" className="w-full text-start">
            Airbnb your Home
          </button>
        </form>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/my-homes" className="w-full">
          My Listings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/favorites" className="w-full">
          My Favorites
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/reservations" className="w-full">
          My Reservations
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogoutLink className="w-full">Logout</LogoutLink>
      </DropdownMenuItem>
    </>
  );
};
const LoggedOutMenuContent = () => {
  return (
    <>
      <DropdownMenuItem>
        <RegisterLink className="w-full">Register</RegisterLink>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LoginLink className="w-full">Login</LoginLink>
      </DropdownMenuItem>
    </>
  );
};

export async function UserNav() {
  unstable_noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />

          <Image
            src={
              user?.picture ??
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            width={32}
            height={32}
            alt="Image of the user"
            className="rounded-full hidden lg:block"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {user ? (
          <LoggedInMenuContent userId={user.id} />
        ) : (
          <LoggedOutMenuContent />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
