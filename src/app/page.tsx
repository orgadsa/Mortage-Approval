"use client";

import { useState } from "react";
import Image from "next/image";
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
    <div className="fixed inset-0 flex flex-col">
      {/* Sticky header */}
      <header className="bg-poalim-red sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <Image src="/gem-icon.png" alt="" width={32} height={32} />
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
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white shadow-lg border-x border-poalim-border min-h-0">
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
