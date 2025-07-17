import { useState, useEffect } from 'react';
import { RefreshCw, Cloud, CheckCircle, AlertCircle } from 'lucide-react';

export function SyncStatusIndicator({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setStatus('syncing');
        const response = await fetch(`/api/sync-state/${projectId}`);
        const data = await response.json();
        setLastSync(new Date(data.files?.[0]?.lastSync || Date.now()));
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }, 10000); // Sync every 10 seconds

    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="flex items-center gap-2">
      {status === 'idle' && <Cloud />}
      {status === 'syncing' && <RefreshCw className="animate-spin" />}
      {status === 'success' && <CheckCircle className="text-green-500" />}
      {status === 'error' && <AlertCircle className="text-red-500" />}
      {lastSync && (
        <span className="text-gray-500">
          Last synced: {lastSync.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
