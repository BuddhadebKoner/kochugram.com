import GreadPostList from "@/components/shared/GreadPostList";
import Loader from "@/components/shared/Loader";
import SearchResult from "@/components/shared/SearchResult";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDbounce";
import { useGetPosts, useSearchPost } from "@/lib/react-query/queriesAndMutation";
import { useState } from "react";

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const deBouncedValue = useDebounce(searchValue, 500); // searching delay
  // query params
  const { data: searchedPost, isFetching: isSearchFetching } = useSearchPost(deBouncedValue);
  const { data: posts, fetchNextPage: hasNextPage } = useGetPosts()

  console.log(searchedPost, posts);
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }
  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((items) => (items?.documents ?? []).length === 0);


  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
          />
        </div>
        <div className="flex-between w-full max-w-5xl mt-1 mb-7">
          <h3>Popular Today</h3>
          <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
            <p className="small-medium md:base-medium text-light-2">All</p>
            <img
              src="/assets/icons/filter.svg"
              width={20}
              height={20}
              alt="filter"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {
            shouldShowSearchResults ? (
              <SearchResult />
            ) : shouldShowPosts ? (
              <p>
                No posts available
              </p>
            ) : posts.pages.map((item, index) => (
              <GreadPostList key={`page-${index}`} posts={item.documents} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Explore