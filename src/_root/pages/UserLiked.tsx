import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
interface UserContextType {
  user: {
    save: any;
    liked: any;
  };
}
const UserLiked = () => {
  const { user } = useOutletContext<UserContextType>();
  useEffect(() => {
    console.log(user.liked);
  }, [user]);


  return (
    <div>UserLiked</div>
  )
}

export default UserLiked