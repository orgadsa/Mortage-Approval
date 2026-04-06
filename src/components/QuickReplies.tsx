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
    <div className="flex justify-start mb-4 fade-in-up">
      <div className="bg-white rounded-2xl border border-poalim-border shadow-sm overflow-hidden max-w-[85%] w-full sm:w-auto sm:min-w-[280px]">
        <div className="px-4 py-2.5 border-b border-poalim-borderLight">
          <span className="text-[13px] font-bold text-poalim-black">
            בחר/י אחת מהאפשרויות
          </span>
        </div>
        <div className="p-3 space-y-2">
          {replies.map((reply, i) => (
            <button
              key={i}
              onClick={() => onSelect(reply.value)}
              disabled={disabled}
              className="w-full px-4 py-2.5 rounded-xl
                bg-poalim-redLight border border-pink-200
                text-[14px] font-medium text-poalim-gray text-center
                transition-all duration-200
                hover:bg-pink-100 hover:border-pink-300
                active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {reply.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
