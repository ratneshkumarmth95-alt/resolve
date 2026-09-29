import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const machine = engine.getMachine(id);

    if (!machine) {
      return NextResponse.json(
        { success: false, error: 'Machine not found' },
        { status: 404 }
      );
    }

    const readings = engine.getReadings(id);

    return NextResponse.json({
      success: true,
      machine,
      readings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
