import API from "@/utils/api";

export async function searchChatUser(searchQuery: string) {
    try {
        const response = await API.get(`/chats/searchusers/?query=${searchQuery}`);
        return response.data;
    } catch (error) {
        console.error("Error in follow/unfollow action:", error);
        throw error;
    }
}

export async function getUserConversations() {
    try {
        const response = await API.get(`/chats/conversations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user conversations:", error);
        throw error;
    }
}