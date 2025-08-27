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
        return response.data.following;
    } catch (error) {
        console.error("Error fetching following:", error);
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