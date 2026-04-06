"use client";

import { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
  timestamp?: string;
}

function GradientDiamond() {
  return (
    <svg width="18" height="18" viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
      <defs>
        <linearGradient id="msg-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="url(#msg-diamond)" />
    </svg>
  );
}

export default function ChatMessage({ message, timestamp }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4 fade-in-up`}
    >
      {/* Bot diamond icon */}
      {!isUser && (
        <div className="mb-1 mr-1">
          <GradientDiamond />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`px-4 py-2.5 leading-relaxed whitespace-pre-wrap text-[14px] max-w-[80%] ${
          isUser
            ? "bg-poalim-grayBg text-poalim-black rounded-2xl rounded-tl-sm"
            : "text-poalim-gray rounded-2xl"
        }`}
      >
        {message.content}
      </div>

      {/* Timestamp */}
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
