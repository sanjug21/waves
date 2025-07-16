'use client';
import { getUserDetails } from "@/lib/firebase/auth";
import { User } from "@/models/user.model";
import { useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";


interface ProfilePageProps {
    params: {
        id: string;
    }
}

export default function ProfilePage({ params }: ProfilePageProps) {
    const { id } = params;

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentUserFromStore = useAppSelector((state) => state.auth.user);

    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        const fetchAndSetProfileUser = async () => {
            setIsLoading(true);
            setError(null);

            if (currentUserFromStore && currentUserFromStore.uid === id) {
                setProfileUser(currentUserFromStore);
                setAdmin(true);
                setIsLoading(false);
                return;
            }

            try {
                const fetchedUser = await getUserDetails(id);
                if (fetchedUser) {
                    setProfileUser(fetchedUser);
                } else {
                    setError("User not found.");
                    setProfileUser(null);
                }
            } catch (err: any) {
                console.error("Error fetching profile user:", err);
                setError(err.message || "Failed to load user profile.");
                setProfileUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchAndSetProfileUser();
        } else {
            setError("User ID is missing from the URL.");
            setIsLoading(false);
        }

    }, [id, currentUserFromStore]);

    

    const defImage = '/def.png';

    const isFollowing = profileUser?.followers && currentUserFromStore?.uid 
    ? profileUser.followers.includes(currentUserFromStore.uid)
    : false;


    return (
        <div className="rounded-lg space-y-3">
                {/* profile section */}
                <div className="flex p-2 w-full h-60 space-x-4 bg-gray-300 rounded-lg">
                    <img className="w-56 h-56 " src={profileUser?.dp?profileUser?.dp:defImage} alt="" />
                    <div className="w-full p-4 space-y-3">
                        <div className="flex justify-between h-12">
                            <div className=" text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text ">{profileUser?.name}</div>
                         
                        </div>
                        <div className="flex space-x-4 ">
                           

                            <button
                            className="p-2 pl-4 pr-4 bg-black bg-opacity-30 backdrop-blur-md  text-white font-semibold rounded-xl shadow-lg  transition-all duration-300 ease-in-out"
                            >
                            Followers {profileUser?.followers.length}
                            </button>

                            <button
                            className="ml-4 p-2 pl-4 pr-4 bg-black bg-opacity-50 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ease-in-out"
                            >
                            Following {profileUser?.following.length}
                            </button>

                            {!admin && 
                            <button className="ml-4 p-2 pl-4 pr-4 rounded-md bg-blue-500 text-white hover:bg-blue-600" >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                            }
                        </div>
                        {profileUser?.bio && 
                        <div className="max-h-full text-clip">{profileUser?.bio}</div>
                        }
                    </div>
                </div>

              {/* input section */}
              {/* {admin &&
                <div className="bg-white rounded-lg ">
                <div className="flex items-center space-x-3 border-b p-1 bg-gray-300 rounded-t-lg">
                    <img src={profileUser?.dp?profileUser?.dp:defImage} alt="" className="h-10 w-10 object-cover"/>
                    <span className="text-xl">
                        {profileUser?.name}
                    </span>

                </div>
                <div className="rounded-b-lg p-1">
                    <div>
                        Create a wave....
                    </div>
                </div>
              </div>
              } */}
            {/* post section */}

            <div className="p-4 sm:p-6 space-y-4">
                    
                    {profileUser?.posts.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            No waves yet. Be the first to create one!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {profileUser?.posts.map((post) => (
                               <div></div>
                            ))}
                        </div>
                    )}
                </div>
            

           
        </div>
    );
}