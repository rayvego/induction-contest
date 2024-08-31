import Image from "next/image";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // const user = await getLoggedInUser();
  // if (user) redirect("/");

  return <main className="flex items-center justify-center bg-gray-100">{children}</main>;
}
