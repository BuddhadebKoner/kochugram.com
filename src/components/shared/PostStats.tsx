import { toast } from "@/hooks/use-toast";
import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



type PostStatsProps = {
   post: Models.Document;
   userId: string;
}
const PostStats = ({ post, userId }: PostStatsProps) => {
   const likesList = post.likes.map((user: Models.Document) => user.$id);
   const [likes, setLikes] = useState(likesList);
   const [isSaved, setIsSaved] = useState(false);

   const { mutate: likePost, isPending: isLikeing } = useLikePost();
   const { mutate: savePost, isPending: isSavingPost } = useSavePost();
   const { mutate: deleetPost, isPending: isDeletingSavePost } = useDeleteSavePost();

   const { data: currentUser } = useGetCurrentUser();
   const savePostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

   useEffect(() => {
      setIsSaved(!!savePostRecord); // here !! is used to convert the value to boolean
   }, [currentUser]);

   const handleLikePosts = (e: React.MouseEvent) => {
      e.stopPropagation();
      let newLikes = [...likes];
      const hasLiked = checkIsLiked(likes, userId);
      if (hasLiked) {
         newLikes = newLikes.filter((id) => id !== userId);
      } else {
         newLikes.push(userId);
      }

      setLikes(newLikes);
      likePost({ postId: post.$id, likesArray: newLikes });
   }
   const handleSavePosts = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (savePostRecord) {
         setIsSaved(false);
         deleetPost(savePostRecord.$id);
      } else {
         savePost({ postId: post.$id, userId });
         setIsSaved(true);
      }
   }
   const shareablePostLink = () => {
      const baseUrl = 'http://localhost:5173/post/';
      const postLink = `${baseUrl}${post.$id}`;

      // Copy the link to the clipboard
      navigator.clipboard.writeText(postLink).then(() => {
         // Show success toast after successfully copying the link
         toast({ title: 'Link copied to clipboard' });
      }).catch(err => {
         // Handle any errors while copying
         toast({ title: 'somthing wrong' });
      });
   };


   return (
      <div className="flex flex-1 gap-5 justify-center items-center h-fit">
         <button className="flex flex-1 gap-2 items-center">
            {isLikeing ? <Loader /> :
               <img
                  onClick={handleLikePosts}
                  src={checkIsLiked(likes, userId) ?
                     "/assets/icons/liked.svg" :
                     "/assets/icons/like.svg"
                  }
                  alt="save"
               />
            }
            <p className="small-medium lg:base-medium">{likes.length}</p>
         </button>
         <button onClick={handleSavePosts}>
            {
               isDeletingSavePost || isSavingPost ? <Loader /> :
                  <img
                     src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                  />
            }
         </button>
         <div>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <img
                     src="/assets/icons/share.svg"
                     alt="share"
                  />
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  copy link
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   )
}

export default PostStats