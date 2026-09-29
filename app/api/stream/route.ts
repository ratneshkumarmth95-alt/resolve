import { engine } from '@/lib/engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      // Send initial data immediately
      const initialPayload = JSON.stringify(engine.getState());
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      // Subscribe to engine state updates
      const unsubscribe = engine.subscribe((state) => {
        try {
          const payload = JSON.stringify(state);
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch (err) {
          // Ignore stream write errors if client disconnected
        }
      });

      // Keepalive ping every 15 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          // ignore
        }
      }, 15000);

      // Clean up on cancel
      return () => {
        unsubscribe();
        clearInterval(pingInterval);
      };
    },
  });

  return new Response(customStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
