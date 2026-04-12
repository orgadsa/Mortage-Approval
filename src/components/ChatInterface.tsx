"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChatMessage as ChatMessageType,
  MortgageApplication,
  ChatApiResponse,
  QuickReply,
} from "@/types";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ProgressBar from "./ProgressBar";
import QuickReplies from "./QuickReplies";

interface ChatInterfaceProps {
  onComplete: (data: MortgageApplication) => void;
}

interface TimestampedMessage extends ChatMessageType {
  timestamp: string;
}

function getTimeString(): string {
  return new Date().toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const WELCOME_MESSAGE: TimestampedMessage = {
  role: "assistant",
  content: `היי! שמח שבחרת בפועלים משכנתאות.

ספר/י לי קצת — מה מביא אותך אלינו היום? מחפש/ת לקנות דירה, לשפר תנאים על משכנתא קיימת, או אולי משהו אחר?`,
  timestamp: getTimeString(),
};

export default function ChatInterface({ onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<TimestampedMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<MortgageApplication>({});
  const [progress, setProgress] = useState({ filled: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, quickReplies, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: TimestampedMessage = {
        role: "user",
        content: trimmed,
        timestamp: getTimeString(),
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setQuickReplies([]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            currentData: applicationData,
          }),
        });

        let raw: Record<string, unknown>;
        try {
          raw = await response.json();
        } catch {
          throw new Error("שגיאת תקשורת עם השרת. אנא נסה שוב.");
        }

        if (!response.ok) {
          throw new Error((raw.error as string) || "Failed to get response");
        }

        const data = raw as unknown as ChatApiResponse;

        if (data.updatedFields && Object.keys(data.updatedFields).length > 0) {
          setApplicationData((prev) => ({ ...prev, ...data.updatedFields }));
        }

        setProgress({ filled: data.progress, total: data.totalRequired });

        if (data.isComplete) {
          setIsComplete(true);
        }

        setQuickReplies(data.quickReplies ?? []);

        const assistantMessage: TimestampedMessage = {
          role: "assistant",
          content: data.message,
          timestamp: getTimeString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "שגיאה לא צפויה";
        const errorMessage: TimestampedMessage = {
          role: "assistant",
          content: `מצטער, אירעה שגיאה: ${errMsg}\n\nאנא נסה שוב.`,
          timestamp: getTimeString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading, messages, applicationData]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickReply = (value: string) => {
    sendMessage(value);
  };

  const handleSubmit = () => {
    onComplete(applicationData);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      <div className="flex-shrink-0">
        <ProgressBar filled={progress.filled} total={progress.total} />
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 px-4 py-5 overscroll-contain">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} timestamp={msg.timestamp} />
        ))}
        {isLoading && <TypingIndicator />}
        {!isLoading && quickReplies.length > 0 && (
          <QuickReplies
            replies={quickReplies}
            onSelect={handleQuickReply}
            disabled={isLoading}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {isComplete && (
        <div className="flex-shrink-0 px-4 pb-2">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-poalim-red hover:bg-poalim-redHover text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
          >
            שליחת הבקשה וצפייה בסיכום ←
          </button>
        </div>
      )}

      <div className="flex-shrink-0 border-t border-poalim-border bg-white px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 min-w-[40px] rounded-full bg-poalim-red text-white flex items-center justify-center
              hover:bg-poalim-redHover disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              transition-colors touch-manipulation"
            aria-label="שלח"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[18px] h-[18px] rotate-180"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={quickReplies.length > 0 ? "ניתן גם להקליד תשובה חופשית..." : "הקלד/י הודעה..."}
            className="flex-1 min-w-0 border border-poalim-border rounded-xl px-4 py-2.5
              focus:ring-2 focus:ring-poalim-red/20 focus:border-poalim-red
              bg-poalim-grayBg text-poalim-black placeholder-gray-400
              text-[16px] leading-relaxed transition-colors h-10"
            enterKeyHint="send"
          />
        </div>
      </div>
    </div>
  );
}
