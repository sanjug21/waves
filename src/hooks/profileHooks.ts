import API from "@/utils/api";
import { Post, UserDetails } from "../types/types";

export async function getUser(userId: string) {
    try {
        const response = await API.get(`/user/getDetails?id=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
}


export async function checkIsFollowing(targetUserId: string): Promise<{ isFollowing: boolean }> {
    try {
        const response = await API.get(`/user/isFollowing?id=${targetUserId}`);
        return response.data;
    } catch (error) {
        console.error("Error checking follow status:", error);
        return { isFollowing: false };
    }
}

export async function getFollowers(userId: string): Promise<UserDetails[]> {
    try {
        const response = await API.get(`/user/getFollowers?id=${userId}`);
        return response.data.followers;
    } catch (error) {
        console.error("Error fetching followers:", error);
        throw error;
    }
}

export async function getFollowing(userId: string): Promise<UserDetails[]> {
    try {
        const response = await API.get(`/user/getFollowings?id=${userId}`);
        return response.data.followings;
    } catch (error) {
        console.error("Error fetching followings:", error);
        throw error;
    }
}


export async function followUnfollowUser(userId: string) {
    try {
        const response = await API.post("/user/follow", { userId });
        return response.data;
    } catch (error) {
        console.error("Error in follow/unfollow action:", error);
        throw error;
    }
}

export async function getPosts(page: number, limit: number, userId: string): Promise<{ posts: Post[], hasMore: boolean }> {
    try {
        const url = `/posts/userposts?page=${page}&limit=${limit}&userId=${userId}`;
        const response = await API.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

export async function updateProfileImage(image: File): Promise<{ dp: string }> {
    try {
        const formData = new FormData();
        formData.append("image", image);

        const response = await API.post("/user/updateDp", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating profile image:", error);
        throw error;
    }
}

export async function updateProfileDetails(details: Partial<UserDetails>): Promise<UserDetails> {
    try {
        const response = await API.patch("/user/updatedetails", details);
        return response.data.user;
    } catch (error) {
        console.error("Error updating profile details:", error);
        throw error;
    }
}

