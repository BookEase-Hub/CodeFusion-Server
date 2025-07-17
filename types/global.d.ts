declare global {
  interface Window {
    editorContext: {
      files: Array<{
        path: string;
        content: string;
      }>;
      projectStructure: string[];
      terminalOutput: string;
    };
  }
}

export {};
