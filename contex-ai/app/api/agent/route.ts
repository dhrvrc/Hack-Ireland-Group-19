// app/api/agent/parse/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * A POST route that takes a user command, sends it to GPT,
 * and returns an array of "AgentAction" objects in JSON.
 */
export async function POST(req: NextRequest) {
  try {
    // 1) Parse the JSON body from the request
    const body = await req.json(); // { userCommand: string }
    const userCommand: string = body?.userCommand ?? "";

    // 2) Create a system prompt instructing GPT to only return valid JSON
    const systemPrompt = `
      You are an AI that receives user instructions to navigate a web UI.
      You should output only valid JSON, which is an array of actions.
      Each action is an object with:
        - type: "click" | "hover" | "type" | "navigate"
        - targetId: string (the controlId of the element)
        - text?: string (only for "type" action)
        - navigateUrl?: string (only for "navigate")
      Example:
      [
        { "type": "click", "targetId": "home-button" },
        { "type": "type", "targetId": "my-input", "text": "Hello" }
      ]
    `;

    const userPrompt = `User command: "${userCommand}"`;

    // 3) Call the OpenAI Chat Completion API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    // 4) Extract GPT response text
    let assistantContent =
      response.choices[0]?.message?.content?.trim() || "[]";

    // 5) Attempt to parse as JSON
    let actions;
    try {
      actions = JSON.parse(assistantContent);
    } catch {
      actions = [];
    }

    return NextResponse.json({ actions });
  } catch (error: any) {
    console.error("Error in parse route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
