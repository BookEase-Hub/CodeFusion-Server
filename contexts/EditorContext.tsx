import React, { createContext, useContext, useState, useEffect } from "react";

interface EditorContextType {
  activeFile: string;
  projectStructure: string[];
  terminalHistory: string[];
  updateActiveFile: (file: string) => void;
  updateProjectStructure: (structure: string[]) => void;
  updateTerminalHistory: (history: string[]) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeFile, setActiveFile] = useState("");
  const [projectStructure, setProjectStructure] = useState<string[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);

  return (
    <EditorContext.Provider
      value={{
        activeFile,
        projectStructure,
        terminalHistory,
        updateActiveFile: setActiveFile,
        updateProjectStructure: setProjectStructure,
        updateTerminalHistory: setTerminalHistory,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditorContext must be used within EditorProvider");
  return context;
};
