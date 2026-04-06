"use client";

export default function TypingIndicator() {
  return (
    <div className="flex flex-col items-start mb-4 fade-in-up">
      <div className="mb-1 mr-1">
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="typing-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="url(#typing-diamond)" />
        </svg>
      </div>
      <div className="px-5 py-3.5 rounded-2xl">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-poalim-gray/30 rounded-full animate-bounce-dot [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-poalim-gray/30 rounded-full animate-bounce-dot [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-poalim-gray/30 rounded-full animate-bounce-dot [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
