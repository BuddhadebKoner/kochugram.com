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
      const seasion = await account.createSession(
         user.email,
         user.password,
      );

      return seasion;
   } catch (error) {
      console.log(error);
   }
}

export async function getCurrentUser() {
   try {
      const currentAccount = await account.get();
      if (!currentAccount) {
         throw Error;
      }

      const currentUser = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         [Query.equal('accountId', currentAccount.$id)]
      )
      if (!currentUser) {
         throw Error;
      }
      return currentUser.documents[0];
   } catch (error) {
      console.log(error);
   }
}