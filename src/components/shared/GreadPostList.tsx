import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite"
import { Link } from "react-router-dom";

type postListProps = {
   posts: Models.Document[];
   showUser?: boolean;
   showStats?: boolean;
}

const GreadPostList = ({ posts }: postListProps) => {
   const { user } = useUserContext();
   
   return (
      <ul className="grid-container w-full h-full">
         {
            posts?.map((post) => (
               <li key={post.$id} className="relative w-full h-full">
                  <Link to={`/post/${post.$id}`} className="grid-post_link">
                     <img
                        src={post.imageUrl}
                        alt={post.caption}
                        className="object-cover w-full h-full"
                     />
                  </Link>
               </li>
            ))
         }
      </ul>
   )
}


export default GreadPostList