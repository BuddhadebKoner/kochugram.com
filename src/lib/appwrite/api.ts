import { ID } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, database } from "./config";
import { Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
   try {
      const newAccount = await account.create(
         ID.unique(),
         user.email,
         user.password,
         user.name,
      )
      if (!newAccount) throw Error;
      const avatarUrl = avatars.getInitials(user.name);

      const newUser = await saveUserToDatabase({
         accountId: newAccount.$id,
         email: newAccount.email,
         name: newAccount.name,
         username: user.username,
         imageUrl: avatarUrl,
      });

      return newUser;
   } catch (error) {
      console.error(error);
      return error;
   }
}


export async function saveUserToDatabase(user: {
   accountId: string,
   email: string,
   name: string,
   imageUrl: URL,
   username?: string,
}) {
   try {
      const newUser = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         ID.unique(),
         user,
      );

      return newUser;
   } catch (error) {
      console.error(error);
      return error;
   }
}

export async function signInAccount(user: { email: string; password: string }) {
   try {
      // Check if the user already has an active session
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
         console.log("Session already exists for user:", currentAccount);
         return currentAccount; // Return if session already exists
      }

      // Create a new session if no active session exists
      const session = await account.createEmailPasswordSession(
         user.email,
         user.password,
      );

      return session;
   } catch (error) {
      console.error("Error signing in:", error);
      return error;
   }
}


export async function getCurrentUser() {
   try {
      const currentAccount = await account.get();
      console.log(currentAccount);
      if (!currentAccount) {
         return null;
      }

      const currentUser = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         [Query.equal('accountId', currentAccount.$id)]
      );

      if (currentUser.documents.length === 0) {
         return null;
      }
      return currentUser.documents[0];
   } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
   }
}
