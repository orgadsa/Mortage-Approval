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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get response");
        }

        const chatData = data as ChatApiResponse;

        if (chatData.updatedFields && Object.keys(chatData.updatedFields).length > 0) {
          setApplicationData((prev) => ({ ...prev, ...chatData.updatedFields }));
        }

        setProgress({ filled: chatData.progress, total: chatData.totalRequired });

        if (chatData.isComplete) {
          setIsComplete(true);
        }

        if (chatData.quickReplies && chatData.quickReplies.length > 0) {
          setQuickReplies(chatData.quickReplies);
        }

        const assistantMessage: TimestampedMessage = {
          role: "assistant",
          content: chatData.message,
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
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-40">
        <ProgressBar filled={progress.filled} total={progress.total} />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
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

      {/* Submit button */}
      {isComplete && (
        <div className="px-4 pb-2">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-poalim-red hover:bg-poalim-redHover text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
          >
            שליחת הבקשה וצפייה בסיכום ←
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-poalim-border bg-white px-4 py-3">
        <div className="flex gap-2.5 items-end">
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-poalim-red text-white flex items-center justify-center
              hover:bg-poalim-redHover disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              transition-colors"
            aria-label="שלח"
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
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="הקלד/י הודעה..."
            rows={1}
            className="flex-1 resize-none border border-poalim-border rounded-xl px-4 py-2.5
              focus:ring-2 focus:ring-poalim-red/20 focus:border-poalim-red
              bg-poalim-grayBg text-poalim-black placeholder-gray-400
              text-[14px] leading-relaxed transition-colors"
            style={{ maxHeight: "120px", minHeight: "40px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />
        </div>
      </div>
    </div>
  );
}
