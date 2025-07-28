import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export function DevBotInterface() {
  const [messages, setMessages] = useState<Array<{ text: string; from: 'user' | 'bot' }>>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, from: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/bot-command', {
        method: 'POST',
        body: JSON.stringify({ 
          query: input,
          sessionId: 'current-session' 
        })
      });
      const { result } = await response.json();
      setMessages(prev => [...prev, { 
        text: result.message || 'Command executed successfully', 
        from: 'bot' 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        text: error.message, 
        from: 'bot' 
      }]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b">Developer Bot</div>
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((msg: { text: string; from: 'user' | 'bot' }, i: number) => (
          <div key={i} className={`p-2 rounded ${msg.from === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex">
        <input
          className="flex-1 p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command like 'Create new file in src/components'"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          className="bg-blue-500 text-white p-2 rounded-r"
          onClick={sendMessage}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
