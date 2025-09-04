import API from "@/utils/api";

export async function toggleLike(postId: string) {
    try {
        const response = await API.post("/posts/like", { postId });
        return {
            success: true,
            message: response.data.message || "Successfully toggled like",
            data: response.data.like,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.error || "Failed to toggle like",
        };
    }
}

