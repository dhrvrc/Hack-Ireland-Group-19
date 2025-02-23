import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();
const assistant = getAssistant();
const thread = await openai.beta.threads.create();

export async function GET(req: Request) {
  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: "" + req.text
    }
  );

  return NextResponse.json(message);
}

async function getAssistant() {
    const assistant = await openai.beta.assistants.create({
        name: "Contex",
        instructions: "You are a software developer who creates Next.JS web components which are to be used by AI. Write your components and include appropriate AgentContext blocks around them.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4o"
      });

    return assistant;
}