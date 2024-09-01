import { NextResponse } from "next/server";
import { getGroqChatCompletion } from "@/lib/groq";
import { systemPrompts } from "@/lib/prompts";

export async function POST(request: Request) {
  const { section, sectionData } = await request.json();

  try {
    const response = await getGroqChatCompletion(
      [{ role: "user", content: JSON.stringify(sectionData) }],
      systemPrompts[`review${section.charAt(0).toUpperCase() + section.slice(1)}Section`]
    );
    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in review section API:", error);
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}
