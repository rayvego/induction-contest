"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    // setting credentials to let appwrite know which project to use
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // take note of this session as it will be used to refer to the user
  const session = cookies().get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No appwrite session found");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// create an admin client to perform admin operations (these are operations that require admin privileges that are set in the appwrite console)
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    // to get the account details
    get account() {
      return new Account(client);
    },
    // we'll also add other things that we might need
    // to interact with the appwrite database
    get database() {
      return new Databases(client);
    },
    // to interact with the appwrite users (not the database users, the users which we can see under "Auth" tab in the appwrite console)
    get users() {
      return new Users(client);
    },
  };
}
