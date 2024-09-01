// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getGroqChatCompletion } from "@/lib/groq";
import { systemPrompts } from "@/lib/prompts";

export async function POST(request: Request) {
  const { messages } = await request.json();

  try {
    const response = await getGroqChatCompletion(messages, systemPrompts.generalQuestions);
    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}
