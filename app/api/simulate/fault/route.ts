import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';
import { z } from 'zod';

const faultSchema = z.object({
  machineId: z.string(),
  faultType: z.string(),
  speedFactor: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = faultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { machineId, faultType, speedFactor } = parsed.data;

    if (speedFactor && [1, 10, 60].includes(speedFactor)) {
      engine.setSpeed(speedFactor as 1 | 10 | 60);
    }

    const updatedMachine = engine.injectFault(machineId, faultType);

    if (!updatedMachine) {
      return NextResponse.json(
        { success: false, error: 'Machine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Fault ${faultType} injected into ${updatedMachine.name}`,
      machine: updatedMachine,
      state: engine.getState(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
