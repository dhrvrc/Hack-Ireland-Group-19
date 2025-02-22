import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "node:stream";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");

  const client = new ElevenLabsClient({ apiKey: "sk_29a74479053d9ba7c4d919d8e868ce9b04ddb70d86deba7c" });

  await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
  
      output_format: "mp3_44100_128",
  
      text: "The first move is what sets everything in motion.",
  
      model_id: "eleven_multilingual_v2"
  
  });

  return NextResponse.json({ text });
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}