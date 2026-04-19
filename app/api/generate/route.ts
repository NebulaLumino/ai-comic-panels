import { NextRequest, NextResponse } from "next/server";

async function getClient() {
  const OpenAI = (await import("openai")).default;
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    const client = await getClient();
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert comic book writer and panel description artist. Given a user's idea, generate a vivid, detailed comic book panel description along with suggested dialogue and narrative captions. Include panel layout, composition notes, color mood, and character placement. Be creative and cinematic.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.9,
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
