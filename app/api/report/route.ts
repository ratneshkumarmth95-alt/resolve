import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function GET() {
  try {
    const state = engine.getState();
    const machines = state.machines;
    const interventions = state.interventions;

    // Monthly breakdown data for savings chart
    const monthlySavings = [
      { month: 'May', dollarsSaved: 42000, failuresAverted: 3 },
      { month: 'Jun', dollarsSaved: 68000, failuresAverted: 5 },
      { month: 'Jul', dollarsSaved: 95000, failuresAverted: 7 },
      { month: 'Aug', dollarsSaved: 114000, failuresAverted: 8 },
      { month: 'Sep', dollarsSaved: state.totalSavedDollars, failuresAverted: state.failuresAverted },
    ];

    const executedInterventions = interventions.filter((i) => i.status === 'EXECUTED');

    return NextResponse.json({
      success: true,
      summary: {
        totalSavedDollars: state.totalSavedDollars,
        totalHoursPreserved: state.totalHoursPreserved,
        failuresAverted: state.failuresAverted,
        roiMultiple: 14.8,
        activeMonitoredMachines: machines.length,
        criticalRiskAvertedPct: 98.4,
      },
      monthlySavings,
      topInterventions: executedInterventions.length > 0 ? executedInterventions : interventions.slice(0, 4),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
