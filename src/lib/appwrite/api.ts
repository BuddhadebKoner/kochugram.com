import { ID, ImageGravity } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, database, storage } from "./config";
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
         // console.log("Session already exists for user:", currentAccount);
         return currentAccount;
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
      // console.log(currentAccount);
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


export async function signOutAccount() {
   try {
      const seasion = await account.deleteSession('current');
      // console.log("Session deleted:", seasion);
      return seasion;
   } catch (error) {
      console.log(error);
   }
}

export async function createPost(post: INewPost) {
   try {
      // Check if post.file is an array or a single file
      const file = Array.isArray(post.file) ? post.file[0] : post.file;

      if (!file) throw new Error("No file provided");

      // Upload the file
      const uploadedFile = await Uploadfile(file);
      if (!uploadedFile) throw new Error("File upload failed");

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
         deleteFile(uploadedFile.$id);
         throw new Error("File preview generation failed");
      }

      // Convert tags to array 
      const tags = post.tags?.replace(/\s/g, '').split(',') || [];

      // Create the new post document
      const newPost = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         ID.unique(),
         {
            creater: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            ImageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
         }
      );

      if (!newPost) {
         await deleteFile(uploadedFile.$id);
         throw new Error("Post creation failed");
      }

      return newPost;
   } catch (error) {
      console.log("Error in createPost:", error);
   }
}



// supporting functions that many time will be used 
export async function Uploadfile(file: File) {
   try {
      if (!file) throw new Error("File not provided");

      const uploadedFile = await storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file 
      );

      return uploadedFile;
   } catch (error) {
      console.log('Error uploading file:', error);
      throw error;
   }
}


export function getFilePreview(fileId: string) {
   try {
      const fileUrl = storage.getFilePreview(
         appwriteConfig.storageId,
         fileId,
         2000,
         2000,
         ImageGravity.Center,
         100
      );

      if (!fileUrl) throw Error;

      return fileUrl;
   } catch (error) {
      console.log(error);
   }
}

// Argument of type '"top"' is not assignable to parameter of type 'ImageGravity | undefined'.ts(2345)

export async function deleteFile(fileId: string) {
   try {
      const deletedFile = await storage.deleteFile(
         appwriteConfig.storageId,
         fileId,
      );
      return deletedFile;
   } catch (error) {
      console.log(error);
   }
}