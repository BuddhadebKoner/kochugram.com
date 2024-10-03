import {
   // usequery,
   useMutation,
   useQuery,
   useQueryClient,
   // useInfiniteQuery,
} from '@tanstack/react-query'
import { createPost, createUserAccount, deleteSavePosts, getCurrentUser, getRecentPost, likePosts, savePosts, signInAccount, signOutAccount } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'


export const useCreateUserAccount = () => {
   return useMutation({
      mutationFn: (user: INewUser) => createUserAccount(user)
   })
}
export const useSignInAccount = () => {
   return useMutation({
      mutationFn: (user: { email: string; password: string }) => signInAccount(user)
   })
}

export const useSignOutAccount = () => {
   return useMutation({
      mutationFn: signOutAccount
   })
}

export const useCreatePost = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
      }
   })
}

export const useGetRecentPost = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      queryFn: getRecentPost
   })
}


export const useLikePost = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ postId, likesArray }: { postId: string, likesArray: string[] }) => likePosts(postId, likesArray),
      onSuccess: (data) => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }
         )
      }
   })
}
export const useSavePost = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ postId, userId }: { postId: string, userId: string }) => savePosts(postId, userId),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }
         )
      }
   })
}
export const useDeleteSavePost = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (savePostsId: string) => deleteSavePosts(savePostsId),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }
         )
      }
   })
}

export const useGetCurrentUser = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
   });
};