import BigLoader from "@/components/shared/BigLoader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutation";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

const Profile = () => {
   const navigate = useNavigate();
   const { user: CurrentUser, isLoading: currentUserLoading } = useUserContext();
   const { id } = useParams();
   const { data: user, isFetching } = useGetUserById(id || '');

   return (
      <>
         {isFetching ? (
            <div className="w-full h-full justify-start items-center">
               <BigLoader />
            </div>
         ) : (
            <div className="common-container">
               <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                  <button onClick={() => navigate(-1)}>
                     <img width={30} src="/assets/icons/arrow.svg" alt="back-btn" />
                  </button>
                  <h1 className="h3-bold md:h2-bold text-left w-full">
                     {user?.name}
                  </h1>
               </div>
               <div className="max-w-5xl flex gap-6 lg:gap-10 w-full">
                  <img
                     className="w-20 h-20 rounded-full"
                     src={user?.imageUrl}
                     alt={user?.name}
                  />
                  <div className="flex flex-col w-full">
                     <div className=" flex flex-1 w-full justify-between">
                        <div className="flex flex-col w-full">
                           <h2 className="h3-bold md:h2-bold text-left w-full">{user?.name}</h2>
                           <p className="subtle-semibold lg:small-ragular text-light-3">@{user?.username}</p>
                        </div>
                        <div className="flex">
                           {currentUserLoading ? (
                              <Loader />
                           ) : (
                              <>
                                 {/* Show Follow button if viewing someone else's profile */}
                                 {CurrentUser?.id !== user?.$id && (
                                    <Button className="shad-button_primary">Follow</Button>
                                 )}

                                 {/* Show Edit button only for your own profile */}
                                 {CurrentUser?.id === user?.$id && (
                                    <Link to={`/update-profile/${user?.$id}`}>
                                       <img
                                          width={30}
                                          height={30}
                                          src="/assets/icons/settings.svg"
                                          alt="Edit Profile"
                                       />
                                    </Link>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                     <p className="my-2">bio : {user?.bio}</p>
                     <div className="w-full h-fit flex gap-5 my-2">
                        <p>{user?.posts.length} posts</p>
                        <p>{user?.followers.length} followers</p>
                        <p>{user?.following.length} following</p>
                     </div>
                  </div>
               </div>
               <div className="max-w-5xl flex gap-6 lg:gap-10 w-full">
                  <Link
                     className="w-fit h-fit"
                     to={""}>
                     Posts
                  </Link>
                  <Link
                     className="w-fit h-fit"
                     to={`/profile/${user?.$id}/likes`}>
                     Likes
                  </Link>
                  <Link
                     className="w-fit h-fit"
                     to={`/profile/${user?.$id}/saves`}>
                     Saves
                  </Link>
               </div>
               <section>
                  <Outlet />
               </section>
            </div>
         )}
      </>
   );
};

export default Profile;
