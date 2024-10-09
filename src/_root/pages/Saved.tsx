import BigLoader from "@/components/shared/BigLoader";
import { useGetCurrentUserPosts } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Saved = () => {
  const { data: user, isFetching: isLoading } = useGetCurrentUserPosts();
  const [save, setSave] = useState<{ $id: string; post: { imageUrl: string }; caption: string }[]>([]);

  useEffect(() => {
    if (user && user.save) {
      setSave(user.save);
      console.log(user);
    }
  }, [user]);

  if (isLoading) {
    return <BigLoader />;
  }

  if (!save || save.length === 0) {
    return (
      <div>
        <p>No saves yet</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid-container-profile w-full h-full">
        {save.map((savedItem) => (
          <li key={savedItem.$id} className="relative w-full h-full">
            <Link to={`/post/${savedItem.$id}`} className="grid-post_link_profile">
              <img
                src={savedItem.post.imageUrl}
                alt={savedItem.caption}
                className="object-cover w-full h-full"
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Saved;
