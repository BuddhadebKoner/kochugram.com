import { Link, } from "react-router-dom"
import { useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";

const Topbar = () => {
   const { user, isLoading } = useUserContext();

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