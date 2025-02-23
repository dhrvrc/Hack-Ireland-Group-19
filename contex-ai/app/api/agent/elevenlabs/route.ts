import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsService } from "@/lib/elevenLabsService";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const elevenLabsService = new ElevenLabsService(
      process.env.ELEVENLABS_API_KEY as string
    );
    console.log(text);
    const audioBuffer = await elevenLabsService.generateSpeechFromText(text);
    const audioBase64 = audioBuffer.toString("base64");

    return NextResponse.json({ audio: audioBase64 });
  } catch (error: any) {
    console.error("Error in ElevenLabs POST route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
