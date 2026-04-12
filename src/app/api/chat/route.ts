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

const MAX_HISTORY_MESSAGES = 20;

function trimHistory(messages: { role: string; content: unknown }[]) {
  if (messages.length <= MAX_HISTORY_MESSAGES) return messages;
  // Always keep the last N messages, ensuring we start with a user message
  const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
  const firstUserIdx = trimmed.findIndex((m) => m.role === "user");
  return firstUserIdx > 0 ? trimmed.slice(firstUserIdx) : trimmed;
}

async function callClaude(
  apiKey: string,
  system: string,
  messages: { role: string; content: unknown }[],
  retries = 2,
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
      max_tokens: 1024,
      system,
      messages,
      tools: ALL_TOOLS,
    }),
  });

  if (res.status === 429 && retries > 0) {
    const retryAfter = res.headers.get("retry-after");
    const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return callClaude(apiKey, system, messages, retries - 1);
  }

  if (!res.ok) {
    const errorBody = await res.text();
    if (res.status === 429) {
      throw new Error("הבקשה נחסמה בגלל עומס. אנא המתן מספר שניות ונסה שוב.");
    }
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

function extractLastQuestion(text: string): string {
  const sentences = text.split(/(?<=[?؟\n])/);
  for (let i = sentences.length - 1; i >= 0; i--) {
    const s = sentences[i].trim();
    if (s.includes("?") || s.includes("؟")) return s;
  }
  return "";
}

const CLOSED_QUESTION_PATTERNS: {
  patterns: RegExp[];
  replies: QuickReply[];
}[] = [
  {
    patterns: [/סוג.*(דירה|נכס).*\?/, /איזה סוג.*\?/],
    replies: [
      { label: "דירה חדשה מקבלן", value: "דירה חדשה מקבלן" },
      { label: "דירת יד שנייה", value: "דירת יד שנייה" },
      { label: "מחיר למשתכן", value: "מחיר למשתכן" },
    ],
  },
  {
    patterns: [/ייעוד.*\?/, /מטרת.*(רכישה|דירה).*\?/, /למה.*(דירה|נכס).*\?/, /מה.*(ייעוד|מטרת).*\?/],
    replies: [
      { label: "דירה יחידה / עיקרית", value: "דירה יחידה" },
      { label: "דירה חליפית", value: "דירה חליפית" },
      { label: "דירה להשקעה", value: "דירה להשקעה" },
    ],
  },
  {
    patterns: [/מצב.?משפחתי.*\?/, /מצבך המשפחתי.*\?/],
    replies: [
      { label: "רווק/ה", value: "רווק" },
      { label: "נשוי/אה", value: "נשוי" },
      { label: "גרוש/ה", value: "גרוש" },
      { label: "אלמן/ה", value: "אלמן" },
      { label: "ידוע/ה בציבור", value: "ידוע בציבור" },
    ],
  },
  {
    patterns: [/(מין|מגדר).*\?/, /(זכר|נקבה|גבר|אישה).*\?/],
    replies: [
      { label: "זכר", value: "זכר" },
      { label: "נקבה", value: "נקבה" },
    ],
  },
  {
    patterns: [/סוג.*(העסקה|תעסוקה).*\?/, /(שכיר|עצמאי).*\?/],
    replies: [
      { label: "שכיר/ה", value: "שכיר" },
      { label: "עצמאי/ת", value: "עצמאי" },
      { label: "שכיר/ה בעל/ת חברה", value: "שכיר בעל חברה" },
    ],
  },
  {
    patterns: [/מתי.*(צריכ|תצטרכ|דרוש|רוצ).*(כסף|סכום|משכנתא|ביצוע).*\?/],
    replies: [
      { label: "עד חודש", value: "עד חודש" },
      { label: "עד 3 חודשים", value: "עד 3 חודשים" },
      { label: "מעל 3 חודשים", value: "מעל 3 חודשים" },
    ],
  },
  {
    patterns: [/חוזה.*(נחתם|חתום|חתמת).*\?/, /חתמת.*חוזה.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/לווים נוספים.*\?/, /לווה נוסף.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/ילדים.*(מתחת|21).*\?/, /יש ל.? ילדים.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/בחזקתך.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/אזרחות.*(נוספת|אחרת).*\?/, /תושבות מס.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/מקצוע מיוחד.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/רישום.*(על שם|בן.?זוג|בת.?זוג).*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/חופשת לידה.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/עבודה נוספת.*\?/, /מקור עבודה נוסף.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/הכנסו?ת נוספו?ת.*\?/, /הכנסה נוספת.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/התחייבויו?ת.*\?/, /הלוואו?ת.*\?/],
    replies: [
      { label: "כן, יש לי התחייבויות", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/פרטיות.*\?/, /מאשר.*מידע.*\?/, /אישור.*פרטיות.*\?/],
    replies: [
      { label: "אני מאשר/ת", value: "אני מאשר/ת שהמידע ישמש לבחינת בקשת המשכנתא בלבד" },
    ],
  },
  {
    patterns: [/האם.*(עובד|מועסק|עובדת).*\?/, /עובד.*כרגע.*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
  {
    patterns: [/ילדים.*(לא משותפים|משלו|משלה).*\?/],
    replies: [
      { label: "כן", value: "כן" },
      { label: "לא", value: "לא" },
    ],
  },
];

function detectQuickReplies(text: string): QuickReply[] {
  const question = extractLastQuestion(text);
  if (!question) return [];

  for (const entry of CLOSED_QUESTION_PATTERNS) {
    for (const pattern of entry.patterns) {
      if (pattern.test(question)) {
        return entry.replies;
      }
    }
  }
  return [];
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

    const anthropicMessages = trimHistory(
      messages.map((msg: ChatMessage) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }))
    );

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

    if (quickReplies.length === 0 && assistantMessage) {
      quickReplies = detectQuickReplies(assistantMessage);
    }

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
