"use client";

import { useState } from "react";
import { MortgageApplication } from "@/types";
import ChatInterface from "@/components/ChatInterface";
import SummaryScreen from "@/components/SummaryScreen";

type Screen = "chat" | "summary";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("chat");
  const [applicationData, setApplicationData] =
    useState<MortgageApplication | null>(null);

  const handleComplete = (data: MortgageApplication) => {
    setApplicationData(data);
    setScreen("summary");
  };

  const handleBackToChat = () => {
    setScreen("chat");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — tight red bar matching Hapoalim style */}
      <header className="bg-poalim-red shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Diamond logo mark — Hapoalim's signature shape */}
            <div className="w-9 h-9 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 0L28 14L14 28L0 14L14 0Z"
                  fill="white"
                  fillOpacity="0.2"
                />
                <path
                  d="M14 4L24 14L14 24L4 14L14 4Z"
                  fill="white"
                  fillOpacity="0.35"
                />
                <path
                  d="M14 8.5L19.5 14L14 19.5L8.5 14L14 8.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <h1 className="text-white text-base font-bold">אישור עקרוני</h1>
              <p className="text-white/60 text-[11px]">פועלים משכנתאות</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            מחובר
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white shadow-lg border-x border-poalim-border">
        {screen === "chat" ? (
          <ChatInterface onComplete={handleComplete} />
        ) : (
          applicationData && (
            <SummaryScreen data={applicationData} onBack={handleBackToChat} />
          )
        )}
      </main>
    </div>
  );
}
