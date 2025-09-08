import { getSocket } from "@/lib/socket";
import { useAppSelector } from "@/store/hooks";
import { SendMessagePayload } from "@/types/Conversation.type";
import { IdProp } from "@/types/Props.types";
import { set } from "mongoose";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export default function ChatTextField({ id }: IdProp) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>("");
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
    }
  }, [message]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!currentUser) return;

    // const formData = new FormData();
    // formData.append("message", message);
    // formData.append("senderId", currentUser._id); 
    // formData.append("receiverId", id);
    const socket=getSocket();

    const payload:SendMessagePayload={
      message,
      senderId:currentUser._id,
      receiverId:id
    }

    socket.emit("sendMessage", payload);
    setMessage("");
  };

  return (
    <div className="pt-1 pr-2 pl-2 relative h-14">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        className="w-full px-4 pr-12 py-2 resize-none shadow-gray-300 bg-white shadow-2xl rounded-3xl border text-black focus:outline-none focus:ring-2 focus:border-0 focus:ring-[rgb(255,127,80)] overflow-hidden transition-all duration-200 ease-in-out scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-600"
        aria-label="Chat message input"
      />
      <button
        onClick={handleSend}
        disabled={message.trim() === ""}
        aria-label="Send message"
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
          message.trim() === ""
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        <IoMdSend className="h-6 w-6 text-[rgb(0,12,60)]" />
      </button>
    </div>
  );
}
