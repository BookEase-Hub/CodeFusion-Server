import { Continue } from "continue-client";

// Create a singleton instance
let continueInstance: Continue | null = null;

export const getContinueClient = () => {
  if (!continueInstance) {
    continueInstance = new Continue({
      model: "continue-model", // or specify OpenAI, etc.
      contextProvider: async () => {
        return window.editorContext || {};
      },
    });

    void continueInstance.init();
  }

  return continueInstance;
};
