'use client'
import { getUser } from "@/lib/hooks/profileHooks";
import { IdProps, UserDetails } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export default function Chat({ params }: IdProps) {
    const { id } = params;
    const defImg = '/def.png';

    const [chatUser, setChatUser] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const fetchChatUser = async () => {
            try {
                const user = await getUser(id);
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

           <div className="p-2 relative">
            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 pr-12 py-2 resize-none shadow-gray-300 bg-white shadow-2xl rounded-3xl border text-black focus:outline-none focus:ring-1 focus:ring-[rgb(0,12,60)] overflow-hidden"
            />
            <button
                disabled={message.trim() === ""}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                message.trim() === "" ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
                <IoMdSend className="h-6 w-6 text-[rgb(0,12,60)]" />
            </button>
            </div>

        </div>
    );
}
