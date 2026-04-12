"use client";

import Image from "next/image";

export default function TypingIndicator() {
  return (
    <div className="flex flex-col items-start mb-4 fade-in-up">
      <div className="mb-1 mr-1">
        <Image src="/gem-icon.png" alt="" width={24} height={24} />
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
