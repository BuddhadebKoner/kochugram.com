import { Link, useNavigate, } from "react-router-dom"
import { useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const Topbar = () => {

   const navigate = useNavigate();

   const { user, isLoading } = useUserContext();
   const { mutate: signOut, isSuccess, isPending: isLogouting } = useSignOutAccount();

   useEffect(() => {
      if (isSuccess) {
         navigate('/sign-in');
         toast({ title: 'Logged out successfully' });
      }
   }, [isSuccess, navigate]);

   return (
      <section className="topbar">
         <div className="flex-between py-4 px-5">
            <Link to="/" className="flex gap-3 items-center">
               <img
                  src="/assets/images/logo.svg"
                  alt="logo"
                  width={130}
                  height={325}
               />
            </Link>
            <div className="flex gap-4">
               <Button
                  variant={"ghost"}
                  className="shad-button_ghost gap-2 flex items-center justify-start w-fit"
                  onClick={() => signOut()}
               >
                  {
                     isLogouting ? (<Loader />) : (
                        <img
                           src="/assets/icons/logout.svg"
                           alt=""
                           width={30}
                           height={30}
                        />
                     )
                  }
               </Button>
               <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                  {
                     isLoading ? (<Loader />) : (
                        <img
                           src={user.imageUrl || '/assets/iamges/profile-placeholder.jpg'}
                           alt="profile"
                           className="h-8 w-8 rounded-full"
                        />
                     )
                  }
               </Link>
            </div>
         </div>
      </section>
   )
}

export default Topbar