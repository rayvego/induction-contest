import InitialFiles from "@/components/InitialFiles";
import { getFiles, getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function Home() {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/sign-in")
  }

  const files = await getFiles({ userId: user.$id });
  // console.log(files);

  return (
    <section className={"home"}>
      <div className={"home-content"}>
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back,{" "}
            <span className="bg-gradient-to-br from-[#d52beb] via-[#eb2ba1] to-[#eb2b41] bg-clip-text text-transparent">
              {user?.username}
            </span>
          </h1>
        </div>
        <InitialFiles initialFiles={files} userId={user.$id} />
      </div>
    </section>
  );
}
