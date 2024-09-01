"use server"

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import exp from "constants";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_FILE_COLLECTION_ID: FILE_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.equal("userId", [userId])]);

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error(error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    // this is getting the user information from the database, which won't work if you haven't set it up!
    const user = await getUserInfo({ userId: result.$id });

    // we can also get the user information from the session itself
    // return parseStringify(result);

    return parseStringify(user);
  } catch (error) {
    console.error("Error getting logged in user: ", error);
    // return null;
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const response = await account.createEmailPasswordSession(email, password);
    // const user = await getUserInfo({ userId: session.userId });

    return parseStringify(response);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ username, email, password}: SignUpParams) => {

  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(ID.unique(), email, password, username);
    if (!newUserAccount) throw new Error("Error creating user");

    const newUser = await database.createDocument(DATABASE_ID!, USER_COLLECTION_ID!, ID.unique(), {
      userId: newUserAccount.$id,
      username,
      email,
    });

    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error: any) {
    console.error("Error logging out: ", error);
    return null;
  }
}

export async function getFiles({userId}: {userId: string}) {
  try {
    const { database } = await createAdminClient();
    const files = await database.listDocuments(DATABASE_ID!, FILE_COLLECTION_ID!, [Query.equal("user", [userId])]);
    return parseStringify(files.documents);
  } catch (error : any) {
    console.error("Error getting files: ", error);
  }
}

export async function createDocument({ userId, fileName }: { userId: string, fileName: string }) {
  try {
    const { database } = await createAdminClient();
    const newFile = await database.createDocument(DATABASE_ID!, FILE_COLLECTION_ID!, ID.unique(), {
      user: userId,
      fileName,
      content: "",
    });
    return parseStringify(newFile);
  } catch (error: any) {
    console.error("Error creating file: ", error);
    return null;
  }
}

export async function deleteDocument(fileId: string) {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(DATABASE_ID!, FILE_COLLECTION_ID!, fileId);
    return true;
  } catch (error: any) {
    console.error("Error deleting file: ", error);
    return false;
  }
}

export async function saveDocument({ fileId, content }: { fileId: string, content: string }) {
  try {
    const { database } = await createAdminClient();
    const file = await database.updateDocument(DATABASE_ID!, FILE_COLLECTION_ID!, fileId, {
      content,
    });
    return file;
  } catch (error: any) {
    console.error("Error saving file: ", error);
  }
}

export async function getDocument(fileId: string) {
  try {
    const { database } = await createAdminClient();
    const file = await database.getDocument(DATABASE_ID!, FILE_COLLECTION_ID!, fileId);
    return parseStringify(file);
  } catch (error: any) {
    console.error("Error getting file: ", error);
  }
}