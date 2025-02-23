// "use client";

// import { useState } from "react";
// import { useAgentStore } from "@/hooks/AgentControlStore";

// interface AgentChatPopupProps {
//   onClose: () => void;
// }

// export function AgentChatPopup({ onClose }: AgentChatPopupProps) {
//   const [messages, setMessages] = useState<
//     { role: "user" | "assistant"; content: string }[]
//   >([]);
//   const [input, setInput] = useState("");

//   // We'll use queueActions to feed the parsed results into our agent store
//   const queueActions = useAgentStore((s) => s.queueActions);

//   const sendMessage = async () => {
//     const userText = input.trim();
//     if (!userText) return;
//     setInput("");

//     // Show the user's message
//     setMessages((msgs) => [...msgs, { role: "user", content: userText }]);

//     try {
//       // Call our parse API in the App Router
//       const res = await fetch("/api/agent", {
//         method: "POST",
//         body: JSON.stringify({ userCommand: userText }),
//       });
//       const data = await res.json();

//       // data.actions => array of agent actions
//       if (data.actions) {
//         queueActions(data.actions);

//         // Show what GPT returned
//         setMessages((msgs) => [
//           ...msgs,
//           { role: "assistant", content: JSON.stringify(data.actions, null, 2) },
//         ]);
//       }
//     } catch (err) {
//       console.error("Error calling parse route:", err);
//       // Maybe display an error in the chat
//     }
//   };

//   return (
//     <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between p-2 bg-blue-600 text-white">
//         <h3 className="font-semibold">AI Agent</h3>
//         <button className="text-white" onClick={onClose}>
//           ×
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-2 overflow-y-auto">
//         {messages.map((msg, idx) => (
//           <div key={idx} className="mb-2">
//             <div
//               className={
//                 msg.role === "user"
//                   ? "text-blue-800 font-semibold"
//                   : "text-green-600 font-semibold"
//               }
//             >
//               {msg.role === "user" ? "You:" : "Assistant:"}
//             </div>
//             <div className="ml-4 text-black whitespace-pre-line">
//               {msg.content}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input box */}
//       <div className="p-2 border-t border-gray-200">
//         <div className="flex gap-2">
//           <input
//             className="flex-1 text-black border border-gray-300 rounded px-2 py-1"
//             placeholder="Type your request..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 sendMessage();
//               }
//             }}
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
// 1) We still import our Zustand store
import { useAgentStore } from "@/hooks/AgentControlStore";

interface AgentChatPopupProps {
  onClose: () => void;
}

export function AgentChatPopup({ onClose }: AgentChatPopupProps) {
  // Same local state for messages + input
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");

  // Grab the store’s queueActions
  const queueActions = useAgentStore((s) => s.queueActions);

  // 2) We'll need the full components map so we can gather .context from any AgentContext
  const components = useAgentStore((s) => s.components);

  const sendMessage = async () => {
    const userText = input.trim();
    if (!userText) return;
    setInput("");

    // Add the user's message to the chat history
    setMessages((msgs) => [...msgs, { role: "user", content: userText }]);

    try {
      // 3) Gather the context strings from any "AgentContext" or other comps that have .context
      const allPageContexts = Object.values(components)
        .filter((comp) => comp.context) // only components with a non-empty context
        .map((comp) => comp.context)
        .join("\n");

      // 4) Call the parse API, passing both the user’s text + the gathered pageContext
      const res = await fetch("/api/agent", {
        method: "POST",
        body: JSON.stringify({
          userCommand: userText,
          pageContext: allPageContexts,
        }),
      });
      const data = await res.json();

      // 5) If GPT returns an array of actions, queue them
      if (data.actions) {
        queueActions(data.actions);

        // Also display them in the chat as the Assistant's "raw JSON"
        setMessages((msgs) => [
          ...msgs,
          { role: "assistant", content: JSON.stringify(data.actions, null, 2) },
        ]);
      }
    } catch (err) {
      console.error("Error calling parse route:", err);
      // You could show an error message in the chat if you like
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-blue-600 text-white">
        <h3 className="font-semibold">AI Agent</h3>
        <button className="text-white" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-2 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <div
              className={
                msg.role === "user"
                  ? "text-blue-800 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              {msg.role === "user" ? "You:" : "Assistant:"}
            </div>
            <div className="ml-4 text-black whitespace-pre-line">
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-2 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            className="flex-1 text-black border border-gray-300 rounded px-2 py-1"
            placeholder="Type your request..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
