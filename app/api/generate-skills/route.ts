import { NextResponse } from "next/server";
import { getGroqChatCompletion } from "@/lib/groq";
import { systemPrompts } from "@/lib/prompts";

export async function POST(request: Request) {
  const { resumeData } = await request.json();

  try {
    const response = await getGroqChatCompletion(
      [{ role: "user", content: JSON.stringify(resumeData) }],
      systemPrompts.generateSkills
    );
    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in generating skills API:", error);
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}
