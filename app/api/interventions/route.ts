import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function GET() {
  try {
    const interventions = engine.getInterventions();
    return NextResponse.json({
      success: true,
      interventions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
