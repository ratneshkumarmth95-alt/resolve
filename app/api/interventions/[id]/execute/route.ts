import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const executedIntervention = engine.executeIntervention(id);

    if (!executedIntervention) {
      return NextResponse.json(
        { success: false, error: 'Intervention not found or already executed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Intervention executed successfully',
      intervention: executedIntervention,
      state: engine.getState(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
