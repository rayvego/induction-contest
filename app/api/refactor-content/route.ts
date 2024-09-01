import { NextResponse } from "next/server";
import { getGroqChatCompletion } from "@/lib/groq";
import { systemPrompts } from "@/lib/prompts";

export async function POST(request: Request) {
  const { content } = await request.json();

  try {
    const response = await getGroqChatCompletion([{ role: "user", content }], systemPrompts.refactorContent);
    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in refactor content API:", error);
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}
