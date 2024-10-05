import { Models } from "appwrite";
import BigLoader from "./BigLoader";
import GreadPostList from "./GreadPostList";

type searchPostProps = {
  isSearchFetching: boolean;
  searchedPost: Models.Document[];
}

const SearchResult = ({ isSearchFetching, searchedPost }: searchPostProps) => {

  if (isSearchFetching) return <BigLoader />
  if (searchedPost && searchedPost.documents.length > 0) {
    return (
      <GreadPostList posts={searchedPost.documents} />
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">
      no result found
    </p>
  )
}

export default SearchResult