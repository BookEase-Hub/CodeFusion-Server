"use client";

import React, { useState } from "react";
import { useContinue } from "@/hooks/useContinue";

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const { continueClient } = useContinue();

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await continueClient.run(
        {
          messages: [{ role: "user", content: input }],
        },
        (chunk) => {
          setResponse((prev) => prev + chunk.content);
        }
      );
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-bold mb-2">AI Assistant</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask for help with code..."
        className="w-full p-2 border rounded-md"
      />
      <button onClick={handleSend} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
        Send
      </button>
      <div className="mt-4 whitespace-pre-wrap">{response}</div>
    </div>
  );
};
