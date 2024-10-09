import BigLoader from "@/components/shared/BigLoader";
import { useGetCurrentUserPosts } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState, Key } from "react";
import { Link, useNavigate } from "react-router-dom";

const Saved = () => {
  const navigate = useNavigate();
  const { data: user, isFetching: isLoading } = useGetCurrentUserPosts();
  const [save, setSave] = useState<
    { $id: string; post: {
      $id: Key | null | undefined;
      caption: string | undefined; imageUrl: string 
}; caption: string }[]
  >([]);

  useEffect(() => {
    if (user && user.save) {
      setSave(user.save);
      console.log('user.save', user)
    }
  }, [user]);

  if (isLoading) {
    return <BigLoader />;
  }

  if (!save || save.length === 0) {
    return (
      <div className="common-container">
        <h2 className="h3-bold md:h2-bold text-left w-full px-4">
          Saved Posts
        </h2>
        <p>No saves yet</p>
      </div>
    );
  }

  return (
    <div className="common-container">
      <div className="max-w-5xl flex-start gap-5 justify-start w-full">
        <button onClick={() => navigate(-1)}>
          <img
            width={30}
            src="/assets/icons/arrow.svg"
            alt="back-btn"
          />
        </button>
        <h1 className="h3-bold md:h2-bold text-left w-full">
          Saved post
        </h1>
      </div>
      <ul className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {save.map((savedItem) => (
          <li key={savedItem.post.$id} className="relative">
            <Link to={`/post/${savedItem.post.$id}`} className="grid-post_link_profile block overflow-hidden rounded-lg">
              <img
                src={savedItem.post.imageUrl}
                alt={savedItem.post.caption}
                className="object-cover w-full sm:h-56 md:h-64 lg:h-72 rounded-[10px]"
              />
            </Link>
          </li>
        ))}
      </ul>
      <p>Add more</p>
    </div>
  );
};

export default Saved;
