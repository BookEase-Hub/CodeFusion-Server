import React from 'react';
import { EditorProvider } from "../contexts/EditorContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EditorProvider>{children}</EditorProvider>
      </body>
    </html>
  );
}
