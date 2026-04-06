"use client";

import { QuickReply } from "@/types";

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function QuickReplies({
  replies,
  onSelect,
  disabled,
}: QuickRepliesProps) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex justify-end mb-4 px-1">
      <div className="flex flex-wrap gap-2 justify-end max-w-[85%]">
        {replies.map((reply, i) => (
          <button
            key={i}
            onClick={() => onSelect(reply.value)}
            disabled={disabled}
            className="px-4 py-2 rounded-full border-2 border-poalim-red text-poalim-red bg-white
              text-sm font-medium transition-all duration-200
              hover:bg-poalim-red hover:text-white hover:shadow-md
              active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-poalim-red"
          >
            {reply.label}
          </button>
        ))}
      </div>
    </div>
  );
}
