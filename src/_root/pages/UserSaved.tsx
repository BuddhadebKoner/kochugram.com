import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

interface UserContextType {
  user: {
    save: any;
  };
}

const UserSaved = () => {
  const { user } = useOutletContext<UserContextType>();
  useEffect(() => {
    console.log(user.save);
  }, [user]);

  return (
    <div>UserSaved</div>
  )
}

export default UserSaved