"use client";

import { useContinue } from "@/hooks/useContinue";

export const TestContinueButton = () => {
  const { continueClient } = useContinue();

  const testPrompt = async () => {
    await continueClient.run(
      {
        messages: [{ role: "user", content: "Write a function to reverse a string in JavaScript" }],
      },
      (chunk) => {
        console.log("Received chunk:", chunk);
      }
    );
  };

  return (
    <button onClick={testPrompt} className="px-4 py-2 bg-green-500 text-white rounded-md">
      Test Continue
    </button>
  );
};
