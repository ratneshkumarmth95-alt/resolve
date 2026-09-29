'use client';

import { useEffect } from 'react';
import { useMurmurStore } from '@/lib/store';

export const SSEListener: React.FC = () => {
  const updateStateFromApi = useMurmurStore((s) => s.updateStateFromApi);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      eventSource = new EventSource('/api/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          updateStateFromApi(data);
        } catch (err) {
          // ignore ping or malformed JSON
        }
      };

      eventSource.onerror = () => {
        // Fallback polling if SSE drops
        if (eventSource) eventSource.close();
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [updateStateFromApi]);

  return null;
};
