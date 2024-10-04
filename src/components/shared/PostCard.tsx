import { useUserContext } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { Models } from "appwrite"
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
   post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {

   // Independent function to parse caption and detect URLs
   function parseCaption(caption: string): JSX.Element[] {
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      const parts = caption.split(urlRegex);

      return parts.map((part, index) => {
         if (urlRegex.test(part)) {
            return (
               <a
                  key={index}
                  href={part}
                  className="text-light-3 underline"
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  {part}
               </a>
            );
         }
         return <span key={index}>{part}</span>;
      });
   }

   const { user } = useUserContext();
   if (!post.creator) return;

   return (
      <div className="post-card flex flex-1 flex-row gap-5 relative">
         <div className="w-fit h-full">
            <Link to={`/profile/${post.creator.$id}`}>
               <img
                  src={post?.creator?.imageUrl || 'assets/images/profile-placeholder.jpg'}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt={post.creator.name} />
            </Link>
         </div>
         <div className="flex flex-1 flex-col ">
            <div className="flex flex-1 gap-2 ">
               <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
               <p className="subtle-semibold lg:small-ragular text-light-3">
                  @{post.creator.username} . {formatDate(post.$createdAt)}
               </p>
               <Link
                  className={`absolute right-5 ${user?.id !== post.creator.$id && "hidden"}`}
                  to={`/update-post/${post.$id}`}
               >
                  <img
                     src="assets/icons/edit.svg"
                     width={20}
                     height={20}
                     alt="edit" />
               </Link>
            </div>
            <Link to={`/post/${post.$id}`}>
               <div className="small-medium lg:base-medium py-2">
                  <p className="whitespace-pre-wrap text-light-2">
                     {parseCaption(post.caption)}
                  </p>
                  <ul className="mt-2">
                     {post.tags.map((tags: string) => (
                        <li key={tags} className="text-light-3">
                           #{tags}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="w-full h-full">
                  <img
                     src={post.imageUrl}
                     className="post-card_img"
                     alt={post.caption} />
               </div>
            </Link>
            <PostStats
               post={post}
               userId={user.id}
            />
         </div>
      </div >
   )
}

export default PostCard