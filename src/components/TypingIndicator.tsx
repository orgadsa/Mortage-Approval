"use client";

export default function TypingIndicator() {
  return (
    <div className="flex justify-end mb-3 fade-in-up">
      <div className="flex items-end gap-2 flex-row-reverse">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-poalim-red text-white">
          <svg width="13" height="13" viewBox="0 0 28 28" fill="white">
            <path d="M14 4L24 14L14 24L4 14L14 4Z" />
          </svg>
        </div>
        <div className="px-5 py-3.5 rounded-2xl rounded-bl-sm bg-white border border-poalim-border shadow-sm">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-poalim-gray/40 rounded-full animate-bounce-dot [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-poalim-gray/40 rounded-full animate-bounce-dot [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-poalim-gray/40 rounded-full animate-bounce-dot [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}
