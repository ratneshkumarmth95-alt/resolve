'use client';

import React, { useEffect } from 'react';
import { CostOfInactionTicker } from '@/components/dashboard/CostOfInactionTicker';
import { DigitalTwinMap } from '@/components/dashboard/DigitalTwinMap';
import { DriftRadar } from '@/components/charts/DriftRadar';
import { RiskVelocityHeatmap } from '@/components/dashboard/RiskVelocityHeatmap';
import { EarlyInterventionQueue } from '@/components/dashboard/EarlyInterventionQueue';
import { ChaosModePanel } from '@/components/dashboard/ChaosModePanel';
import { useMurmurStore } from '@/lib/store';

export default function DashboardPage() {
  const { updateStateFromApi } = useMurmurStore();

  useEffect(() => {
    // Initial fetch of machine telemetries and interventions
    fetch('/api/machines')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          updateStateFromApi({ machines: data.machines });
        }
      });

    fetch('/api/interventions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          updateStateFromApi({ interventions: data.interventions });
        }
      });
  }, [updateStateFromApi]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Top Bar: Live Cost-of-Inaction Ticker */}
      <CostOfInactionTicker />

      {/* 2. Main Dashboard Grid: Digital Twin Floor Map & Chaos Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DigitalTwinMap />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <DriftRadar />
        </div>
      </div>

      {/* 3. Chaos Mode Simulation Panel */}
      <ChaosModePanel />

      {/* 4. Secondary Grid: Early Intervention Queue & Risk Velocity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarlyInterventionQueue />
        <RiskVelocityHeatmap />
      </div>
    </div>
  );
}
