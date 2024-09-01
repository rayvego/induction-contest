import Nav from "@/components/Nav";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <main className={"flex w-full h-screen"}>
      <div className={"flex flex-col size-full"}>
        <div className={"root-layout"}>
          <Link href="/">
            <h1 className="text-3xl">Raysume</h1>
          </Link>
          <div>
            <Nav userId={user.$id}/>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}