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
      {/* Sticky header */}
      <header className="bg-poalim-red sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Gradient diamond — matching Danit's icon */}
            <div className="w-9 h-9 flex items-center justify-center">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <defs>
                  <linearGradient id="diamond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f9a8d4" />
                    <stop offset="50%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path d="M15 1L29 15L15 29L1 15L15 1Z" fill="white" fillOpacity="0.2" />
                <path d="M15 5L25 15L15 25L5 15L15 5Z" fill="white" fillOpacity="0.4" />
                <path d="M15 9L21 15L15 21L9 15L15 9Z" fill="white" />
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
