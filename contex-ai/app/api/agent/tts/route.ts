import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const textToSpeak = body.text || "No text provided";

    // ElevenLabs config
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey || !voiceId) {
      return NextResponse.json(
        { error: "Missing ElevenLabs config" },
        { status: 500 }
      );
    }

    // Call ElevenLabs TTS
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToSpeak,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: errText }, { status: resp.status });
    }

    // The response is audio (mp3) in binary
    const arrayBuffer = await resp.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    // Return as JSON
    return NextResponse.json({ audio: base64Audio });
  } catch (err: any) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
