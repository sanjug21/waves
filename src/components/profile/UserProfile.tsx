import { getUser } from "@/hooks/profileHooks";
import { useAppSelector } from "@/store/hooks";
import { IdProp, UserDetails } from "@/types/types";
import { useEffect, useState } from "react";
import Loader from "../Loader";

export default function UserProfile({id}:IdProp){
    const defImage = '/def.png';

    const [profileUser, setProfileUser] = useState<UserDetails | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentUser = useAppSelector((state) => state.auth.user);
    const currUserId = currentUser?._id;
    const isOwner = currUserId === id;

    useEffect(()=>{
         const getUserDetails=async()=>{
            setLoading(true);
            setError(null);
            try {
                const data = await getUser(id);
                setProfileUser(data);
                setIsFollowing(data.followers.includes(currUserId));
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch user details.");
            } finally {
                setLoading(false);
            }
        }

        getUserDetails();

    },[id]);

    //   const followToggle = async () => {
    //         if (!currentUser) return;
    //         const wasFollowing = isFollowing;
    //         setIsFollowing(!wasFollowing);
    
    //         try {
    //             await followUnfollowUser(id);
    
    //             if (wasFollowing) {
    //                 setFollowers((prev) => prev.filter((f) => f._id !== currUserId));
    //             } else if (followers.length > 0) {
    //                  const followerData: UserDetails = {
    //                     _id: currentUser._id,
    //                     name: currentUser.name,
    //                     email: currentUser.email,
    //                     dp: currentUser.dp,
    //                     bio: currentUser.bio || "",
    //                 };
    //                 setFollowers((prev) => [...prev, followerData]);
    //             }
    //         } catch (err: any) {
    //             setIsFollowing(wasFollowing);
    //             setError(err.response?.data?.message || "Action failed. Please try again.");
    //         }
    //     };

    if(loading){
        return <Loader />;
    }

    return(
        <div className="relative bg-white  shadow-2xl p-4 pt-5 transition-all duration-300 ease-in-out rounded-b-lg mb-2">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
                    <img
                        className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[rgb(0,12,60)] shadow-lg"
                        src={profileUser?.dp || defImage}
                        alt={`${profileUser?.name}'s profile picture`}
                    />
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left mt-4 sm:mt-0">
                        <h1 className="text-3xl sm:text-4xl font-bold text-black">
                            {profileUser?.name}
                        </h1>
                        <p className="text-sm text-gray-400 my-2">{profileUser?.email}</p>
                        {profileUser?.bio && (
                            <p className="text-gray-300 mt-2 max-w-full">
                                {profileUser.bio}
                            </p>
                        )}
                        {!isOwner && (
                            <div className="flex space-x-4 mt-4">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors" >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition-colors">
                                    Message
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );

}