'use client'
import ChatTextField from "@/components/ChatComponents/chatTextField";
import { getUser } from "@/hooks/profileHooks";
import { UserDetails } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export default function Chat() {
    const params=useParams();
    const id=params?.id as string;
    const defImg = '/def.png';

    const [chatUser, setChatUser] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const fetchChatUser = async () => {
            try {
                const user = await getUser(id );
                setChatUser(user);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setError("Unable to load user details.");
            }
        };
        fetchChatUser();
    }, [id]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; 
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`; 
    }
  }, [message]);

    const isSendDisabled = message.trim() === "";

    return (
        <div className="h-[calc(100vh-75px)] bg-blue-100 text-white flex flex-col justify-between pt-0.5 ChatBg">
            
            <div>
                <div className="flex items-center space-x-4 bg-gradient-to-r from-[rgb(0,12,60)] to-[rgb(0,20,80)] p-2 shadow-lg backdrop-blur-md border-b border-blue-400">
                    <img
                        src={chatUser?.dp || defImg}
                        alt={`${chatUser?.name || 'User'}'s profile picture`}
                        className="h-12 w-12 rounded-full object-cover shadow-sm"
                    />
                    <div>
                        <h1 className="text-xl font-semibold text-white">{chatUser?.name}</h1>
                    </div>
                </div>
            </div>

          <ChatTextField id={id} />

        </div>
    );
}
