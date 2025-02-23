// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// /**
//  * A POST route that takes a user command, sends it to GPT,
//  * and returns an array of "AgentAction" objects in JSON.
//  */
// export async function POST(req: NextRequest) {
//   try {
//     // 1) Parse the JSON body from the request
//     const body = await req.json(); // { userCommand: string, pageContext?: string }
//     const userCommand: string = body?.userCommand ?? "";
//     const pageContext: string = body?.pageContext ?? "";

//     // 2) Detailed system prompt, instructing LLM to return valid JSON only
//     const baseSystemPrompt = `
//       You are an AI agent that receives user instructions to navigate a web UI.
//       You should output only valid JSON, which is an array of actions.
//       Each action is an object with:
//         - type: "click" | "hover" | "type" | "navigate"
//         - targetId: string (the controlId of the element)
//         - text?: string (only for "type" action)
//         - navigateUrl?: string (only for "navigate")

//       Example:
//       [
//         { "type": "click", "targetId": "home-button" },
//         { "type": "type", "targetId": "my-input", "text": "Hello" }
//       ]

//       # Additional instruction:
//       If the user is on the landing page and wants to go to the Library page, do it by clicking
//       the button with controlId "library-button". 
//       For example, return:
//       [
//         { "type": "click", "targetId": "library-button" }
//       ]
//       Similarly, if the user wants to go to the Genrator page, do it by clicking
//       the button with controlId "generator-button".

//       Respond only with valid JSON, no extra text.
//     `;

//     // 3) Merge the page context with base system prompt
//     //    so GPT knows about the specific page's controls, etc.
//     const finalSystemPrompt = `
//         ${baseSystemPrompt}

//         # Current Page Context (if any):
//         ${pageContext}
//         `;

//     const userPrompt = `User command: "${userCommand}"`;

//     // 4) Call the OpenAI Chat Completion API
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       temperature: 0,
//       messages: [
//         { role: "system", content: finalSystemPrompt },
//         { role: "user", content: userPrompt },
//       ],
//     });

//     // 5) Extract GPT response text
//     let assistantContent =
//       response.choices[0]?.message?.content?.trim() || "[]";

//     // 6) Attempt to parse as JSON
//     let actions;
//     try {
//       actions = JSON.parse(assistantContent);
//     } catch {
//       actions = [];
//     }

//     return NextResponse.json({ actions });
//     } catch (error: any) {
//     console.error("Error in parse route:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     }



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
    const body = await req.json(); // { userCommand: string, pageContext?: string }
    const userCommand: string = body?.userCommand ?? "";
    const pageContext: string = body?.pageContext ?? "";

    // 2) Detailed system prompt, instructing LLM to return valid JSON only
    const baseSystemPrompt = `
      You are an AI agent that receives user instructions to navigate a web UI.
      You should output a single JSON object with two keys:
        - "assistantMessage": a short message responding to the user
        - "actions": an array of action objects

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

      # Additional instruction:
      If the user is on the landing page and wants to go to the Library page, do it by clicking
      the button with controlId "library-button". 
      For example, return:
      [
        { "type": "click", "targetId": "library-button" }
      ]
      Similarly, if the user wants to go to the Genrator page, do it by clicking
      the button with controlId "generator-button".

      Respond only with valid JSON, no extra text.
    `;

    // 3) Merge the page context with base system prompt
    //    so GPT knows about the specific page's controls, etc.
    const finalSystemPrompt = `
        ${baseSystemPrompt}

        # Current Page Context (if any):
        ${pageContext}
        `;

    const userPrompt = `User command: "${userCommand}"`;

    // 4) Call the OpenAI Chat Completion API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    // 5) Extract GPT response text
    let assistantContent =
      response.choices[0]?.message?.content?.trim() || "[]";

    // 6) Attempt to parse as JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(assistantContent);
    } catch {
      parsedResult = { assistantMessage: "", actions: [] };
    }

    const assistantMessage = parsedResult.assistantMessage || "";
    const actions = parsedResult.actions || [];

    return NextResponse.json({ assistantMessage, actions });
  } catch (error: any) {
    console.error("Error in parse route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}