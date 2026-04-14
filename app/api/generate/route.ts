import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "question is required" },
        { status: 400 },
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `次の問題の答えを日本語で説明してください。

        問題: ${question}

        シンプルで、わかりやすく説明してください。
        余計な前置きは書かないでください。
        敬語は不要`,
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "答えを取得できませんでした", debug: response },
        { status: 500 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("OpenAI API error:", error);

    const message =
      error instanceof Error ? error.message : "AI生成に失敗しました";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
