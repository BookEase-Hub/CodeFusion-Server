const WebSocket = require('ws');
const File = require('../models/File');

function setupCollaboration(server) {
  const wss = new WebSocket.Server({ server });

  const connections = new Map();

  wss.on('connection', (ws, req) => {
    const fileId = req.url.split('/').pop();
    if (!connections.has(fileId)) {
      connections.set(fileId, new Set());
    }
    connections.get(fileId).add(ws);
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'edit') {
          // Broadcast changes to all collaborators
          connections.get(fileId).forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'update', changes: data.changes, sender: data.sender }));
            }
          });
          // Update file in database
          await File.findByIdAndUpdate(fileId, {
            content: data.content,
            updatedAt: Date.now()
          });
        }
      } catch (err) {
        console.error('WebSocket Error:', err);
      }
    });
    ws.on('close', () => {
      connections.get(fileId).delete(ws);
      if (connections.get(fileId).size === 0) {
        connections.delete(fileId);
      }
    });
  });

  return wss;
}

module.exports = setupCollaboration;
