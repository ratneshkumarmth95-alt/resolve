import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function GET() {
  try {
    const machines = engine.getMachines();
    return NextResponse.json({
      success: true,
      machines,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
