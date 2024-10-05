import {
   useInfiniteQuery,
   // usequery,
   useMutation,
   useQuery,
   useQueryClient,
   // useInfiniteQuery,
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavePosts, getCurrentUser, getInFininitePost, getPostById, getRecentPost, likePosts, savePosts, searchPost, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
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

export const useGetPostById = (postId: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId
   })
}

export const useUpdatePost = () => {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
         })
      }
   })
}

export const useDeletePost = () => {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
         })
      }
   })
}

//  expore

export const useGetPosts = () => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInFininitePost,
      getNextPageParam: (lastPage) => {
         if (lastPage && lastPage.documents.length > 0) return null;
         const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
         return lastId;
      }
   })
}

export const useSearchPost = (searchTurm: string) => { 
   return useQuery({
      queryKey: [QUERY_KEYS.SEARCH_POSTS],
      queryFn: () => searchPost(searchTurm),
      enabled: !!searchTurm
   })
}