import API from "@/utils/api";

export default async function getUserSuggestion() {
    try{
        const response = await API.get("/user/userSuggestion");
        return response.data;
    } catch (err) {
        console.error("Error fetching user suggestions:", err);
    }  
}
  

  