import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    const client = new OpenAI();

    const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "You are an AI which controls the cursor interactions of a web application. I want you to rate different text instructions as Simple, Medium, Complex, Conversational or Malicious. I want no other text around the output just the classification. I want no confirmation you understood the message or recieved the message just the result. Your string to check is: " + text }],
        store: true,
        stream: true,
    });

    var ptype: string = "";

    for await (const chunk of stream) {
        ptype.concat(chunk.choices[0]?.delta?.content || "")
    }

    switch (ptype) {
        case "Simple":
            break;
        case "Medium":
            break;
        case "Complex":
            break;
        case "Conversational":
            break;
        case "Malicious":
            break;
    }

    return NextResponse.json({ ptype });
}