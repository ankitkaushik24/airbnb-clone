import type { ReactNode } from "react";

export default function CreateHomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <main className="mt-10">{children}</main>;
}
