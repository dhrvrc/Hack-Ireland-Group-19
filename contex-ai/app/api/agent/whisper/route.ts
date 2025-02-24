import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { Readable } from "stream";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // 1) Read form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2) Convert "File" to a Buffer for OpenAI's createTranscription
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3) Call OpenAI Whisper
    const response = await openai.audio.transcriptions.create(
      // pass the buffer as a Readable stream
      new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      }),
      (model = "whisper-1"),
      undefined /* prompt */,
      "json" 
    );

    const text = response.data.text;

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("Whisper error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
