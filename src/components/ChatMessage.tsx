"use client";

import { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-start" : "justify-end"} mb-3 fade-in-up`}
    >
      <div
        className={`flex items-end gap-2 max-w-[80%] ${
          isUser ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${
            isUser
              ? "bg-poalim-grayBg text-poalim-gray border border-poalim-border"
              : "bg-poalim-red text-white"
          }`}
        >
          {isUser ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 28 28" fill="white">
              <path d="M14 4L24 14L14 24L4 14L14 4Z" />
            </svg>
          )}
        </div>
        {/* Message bubble */}
        <div
          className={`px-4 py-2.5 leading-relaxed whitespace-pre-wrap text-[14px] ${
            isUser
              ? "bg-poalim-grayBg text-poalim-black rounded-2xl rounded-br-sm border border-poalim-borderLight"
              : "bg-white text-poalim-black rounded-2xl rounded-bl-sm border border-poalim-border shadow-sm"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
