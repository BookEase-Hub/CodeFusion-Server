import React, { useState, useEffect, ChangeEvent } from 'react';

export function ShortcutConfigurator({ userId }: { userId: string }) {
  const [shortcuts, setShortcuts] = useState<Record<string, string>>({});
  const [newShortcut, setNewShortcut] = useState('');
  const [newCommand, setNewCommand] = useState('');

  useEffect(() => {
    fetch(`/api/get-shortcuts/${userId}`)
      .then(res => res.json())
      .then(setShortcuts);
  }, [userId]);

  const saveShortcut = () => {
    fetch('/api/set-shortcut', {
      method: 'POST',
      body: JSON.stringify({ userId, shortcut: newShortcut, command: newCommand })
    }).then(() => {
      setShortcuts({ ...shortcuts, [newShortcut]: newCommand });
      setNewShortcut('');
      setNewCommand('');
    });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Shortcut</th>
            <th>Command</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(shortcuts).map(([shortcut, command]) => (
            <tr key={shortcut}>
              <td>{shortcut}</td>
              <td>{command}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <input
          placeholder="Ctrl+Shift+M" 
          value={newShortcut} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewShortcut(e.target.value)}
        />
        <input
          placeholder="commandName" 
          value={newCommand} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommand(e.target.value)}
        />
        <button onClick={saveShortcut}>Add Shortcut</button>
      </div>
    </div>
  );
}
