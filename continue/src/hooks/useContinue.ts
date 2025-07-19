import { useEffect, useState } from "react";
import { getContinueClient } from "@/lib/continueClient";

export const useContinue = () => {
  const [continueClient, setContinueClient] = useState<ReturnType<typeof getContinueClient> | null>(null);

  useEffect(() => {
    const client = getContinueClient();
    setContinueClient(client);

    // Clean up listener on unmount
    return () => {
      client.removeAllListeners();
    };
  }, []);

  const registerEditorContext = (context: any) => {
    // Attach current editor context globally for Continue
    (window as any).editorContext = context;
  };

  const onCompletion = (callback: (completion: any) => void) => {
    if (continueClient) {
      continueClient.on("completion", callback);
    }
  };

  return {
    continueClient,
    registerEditorContext,
    onCompletion,
  };
};
