"use client";

import Image from "next/image";
import { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
  timestamp?: string;
}

export default function ChatMessage({ message, timestamp }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4 fade-in-up`}
    >
      {!isUser && (
        <div className="mb-1 mr-1">
          <Image src="/gem-icon.png" alt="" width={24} height={24} className="flex-shrink-0" />
        </div>
      )}

      <div
        className={`px-4 py-2.5 leading-relaxed whitespace-pre-wrap text-[14px] max-w-[80%] ${
          isUser
            ? "bg-poalim-grayBg text-poalim-black rounded-2xl rounded-tl-sm"
            : "text-poalim-gray rounded-2xl"
        }`}
      >
        {message.content}
      </div>

      {timestamp && (
        <div
          className={`flex items-center gap-1 mt-1 ${
            isUser ? "pl-1" : "pr-1"
          }`}
        >
          <span className="text-[11px] text-gray-400">
            {timestamp}
            {!isUser && " • פועלים משכנתאות"}
          </span>
        </div>
      )}
    </div>
  );
}
