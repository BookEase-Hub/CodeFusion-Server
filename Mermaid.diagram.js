// AI returns Mermaid code in response
const aiResponse = await continueClient.run({
  messages: [{ role: "user", content: "Draw a flowchart of my app architecture" }],
});

// Response includes Mermaid diagram
const mermaidCode = aiResponse.content.includes("```mermaid") ? extractMermaid(aiResponse.content) : null;

if (mermaidCode) {
  // Send back Mermaid code to be rendered
  setMessages((prev) => [...prev, { type: 'mermaid', code: mermaidCode }]);
}

<CodeMirror
  value={mermaidCode}
  extensions={[javascript(), html(), python()]}
  onChange={(value) => setMermaidCode(value)}
/>

await fetch('/api/projects/save-diagram', {
  method: 'POST',
  body: JSON.stringify({ projectId, mermaidCode }),
});

function exportSVG() {
  const svgElement = document.querySelector('.mermaid-diagram svg');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'diagram.svg';
  link.click();
}
