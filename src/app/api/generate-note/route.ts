import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import openai from "@/lib/openai";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { prompt, maxTokens = 500 } = await request.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 }
      );
    }

    // Make OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
  } catch (error: unknown) {
    console.error("Error generating note:", error);

    // Handle different types of errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your OpenAI API key." },
          { status: 401 }
        );
      } else if (error.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate text. Please try again." },
      { status: 500 }
    );
  }
}
