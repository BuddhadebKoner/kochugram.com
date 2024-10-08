import { useEffect } from "react";
import { Button } from "../ui/button"

const FollowBtn = ({ followingUser, currentUser }: any) => {
   useEffect(() => {
      console.log(followingUser, currentUser)
   }, [followingUser, currentUser])
   const isFollowing = followingUser.followers.includes(currentUser.id);
   return (
      <div>
         <Button
            className="shad-button_primary">
            {isFollowing ? 'Unfollow' : 'Follow'}
         </Button>
      </div>
   )
}

export default FollowBtn