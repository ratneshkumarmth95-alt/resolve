import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function POST() {
  try {
    engine.resetSimulation();
    return NextResponse.json({
      success: true,
      message: 'Simulation reset to baseline state',
      state: engine.getState(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
