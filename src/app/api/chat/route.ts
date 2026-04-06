export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import {
  MortgageApplication,
  ChatMessage,
  ChatApiResponse,
  QuickReply,
} from "@/types";
import {
  buildSystemPrompt,
  TOOL_DEFINITION,
  QUICK_REPLIES_TOOL,
} from "@/lib/system-prompt";
import { calculateProgress } from "@/lib/mortgage-fields";

const ALL_TOOLS = [TOOL_DEFINITION, QUICK_REPLIES_TOOL];

interface AnthropicContentBlock {
  type: "text" | "tool_use";
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
}

async function callClaude(
  apiKey: string,
  system: string,
  messages: { role: string; content: unknown }[],
): Promise<AnthropicResponse> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system,
      messages,
      tools: ALL_TOOLS,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

function processContentBlocks(
  blocks: AnthropicContentBlock[],
  extractedFields: Partial<MortgageApplication>,
  quickReplies: QuickReply[]
): {
  text: string;
  fields: Partial<MortgageApplication>;
  replies: QuickReply[];
  toolUseBlocks: AnthropicContentBlock[];
} {
  let text = "";
  const toolUseBlocks: AnthropicContentBlock[] = [];

  for (const block of blocks) {
    if (block.type === "text") {
      text += block.text || "";
    } else if (block.type === "tool_use") {
      toolUseBlocks.push(block);
      if (block.name === "update_application_data") {
        extractedFields = {
          ...extractedFields,
          ...(block.input as Partial<MortgageApplication>),
        };
      } else if (block.name === "suggest_quick_replies") {
        const input = block.input as { replies: QuickReply[] };
        if (input.replies) {
          quickReplies = input.replies;
        }
      }
    }
  }

  return { text, fields: extractedFields, replies: quickReplies, toolUseBlocks };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "מפתח API של Anthropic לא הוגדר. יש ליצור קובץ .env.local עם ANTHROPIC_API_KEY",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      messages,
      currentData,
    }: { messages: ChatMessage[]; currentData: MortgageApplication } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(currentData || {});

    const anthropicMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const response = await callClaude(apiKey, systemPrompt, anthropicMessages);

    let result = processContentBlocks(response.content, {}, []);
    let assistantMessage = result.text;
    let extractedFields = result.fields;
    let quickReplies = result.replies;

    // If Claude used tools but didn't provide text, do a follow-up
    if (result.toolUseBlocks.length > 0 && !assistantMessage) {
      const toolResults = result.toolUseBlocks.map((block) => ({
        type: "tool_result" as const,
        tool_use_id: block.id!,
        content:
          block.name === "update_application_data"
            ? "הנתונים עודכנו בהצלחה."
            : "הכפתורים יוצגו ללקוח.",
      }));

      const followUp = await callClaude(apiKey, systemPrompt, [
        ...anthropicMessages,
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ]);

      const followUpResult = processContentBlocks(
        followUp.content,
        extractedFields,
        quickReplies
      );
      assistantMessage += followUpResult.text;
      extractedFields = followUpResult.fields;
      if (followUpResult.replies.length > 0) {
        quickReplies = followUpResult.replies;
      }

      // Handle second-level tool calls if needed
      if (followUpResult.toolUseBlocks.length > 0 && !assistantMessage) {
        const secondToolResults = followUpResult.toolUseBlocks.map((block) => ({
          type: "tool_result" as const,
          tool_use_id: block.id!,
          content:
            block.name === "update_application_data"
              ? "הנתונים עודכנו בהצלחה."
              : "הכפתורים יוצגו ללקוח.",
        }));

        const secondFollowUp = await callClaude(apiKey, systemPrompt, [
          ...anthropicMessages,
          { role: "assistant", content: response.content },
          { role: "user", content: toolResults },
          { role: "assistant", content: followUp.content },
          { role: "user", content: secondToolResults },
        ]);

        const secondResult = processContentBlocks(
          secondFollowUp.content,
          extractedFields,
          quickReplies
        );
        assistantMessage += secondResult.text;
        extractedFields = secondResult.fields;
        if (secondResult.replies.length > 0) {
          quickReplies = secondResult.replies;
        }
      }
    }

    const mergedData = { ...currentData, ...extractedFields };
    const progress = calculateProgress(mergedData);

    const apiResponse: ChatApiResponse = {
      message: assistantMessage,
      updatedFields: extractedFields,
      progress: progress.filled,
      totalRequired: progress.total,
      isComplete: progress.percentage === 100,
      quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
    };

    return NextResponse.json(apiResponse);
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
