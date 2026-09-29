'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  Clock,
  Wrench,
  ShieldCheck,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { WaveformChart } from '@/components/charts/WaveformChart';
import { GhostTimeline } from '@/components/charts/GhostTimeline';
import { formatCurrency, formatSecondsToCountdown, getStatusColor } from '@/lib/utils';
import { useMurmurStore } from '@/lib/store';
import { MachineData } from '@/lib/mock-data';

export default function MachineDetailPage() {
  const params = useParams();
  const machineId = params.id as string;
  const { machines, showToast } = useMurmurStore();

  const [machineData, setMachineData] = useState<MachineData | null>(null);
  const [readings, setReadings] = useState<any[]>([]);

  useEffect(() => {
    // Check local store first, then fetch
    const found = machines.find((m) => m.id === machineId);
    if (found) setMachineData(found);

    const fetchMachineInfo = async () => {
      try {
        const res = await fetch(`/api/machines/${machineId}/readings`);
        const data = await res.json();
        if (data.success) {
          setMachineData(data.machine);
          setReadings(data.readings);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchMachineInfo();
    const interval = setInterval(fetchMachineInfo, 2000);
    return () => clearInterval(interval);
  }, [machineId, machines]);

  if (!machineData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-400 font-mono">
        <Activity className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-2" />
        <p>Loading machine telemetries...</p>
      </div>
    );
  }

  const colors = getStatusColor(machineData.status);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back button header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Digital Twin Dashboard
        </Link>

        <span className={`rounded-full px-3 py-1 font-mono text-xs font-bold border ${colors.badge}`}>
          STATUS: {machineData.status.toUpperCase()}
        </span>
      </div>

      {/* Machine Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#0D111D]/90 p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Zap className="h-4 w-4" /> {machineData.type} • {machineData.location}
          </div>
          <h1 className="text-3xl font-extrabold text-white">{machineData.name}</h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Machine ID: <span className="text-cyan-300">{machineData.id}</span> | Downtime Rate: <span className="text-rose-400 font-bold">{formatCurrency(machineData.downtimeCostPerHr)}/hr</span>
          </p>
        </div>

        {/* Time-to-Scream Countdown Widget */}
        <div className="flex items-center gap-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <Clock className="h-8 w-8 text-rose-400 animate-pulse" />
          <div>
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Time-to-Scream Countdown</span>
            <span className="font-mono text-2xl font-extrabold text-rose-400">
              {formatSecondsToCountdown(machineData.timeToScreamSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Live Waveform & Ghost Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaveformChart
          readings={readings}
          metric={machineData.breachMetric as any}
          threshold={machineData.tempThreshold}
          status={machineData.status}
        />

        <GhostTimeline
          params={{
            downtimeCostPerHr: machineData.downtimeCostPerHr,
            expectedDowntimeHrs: 8,
            driftVelocity: machineData.driftVelocity,
            repairCost: machineData.repairCost,
            actedEarlyCost: 500,
          }}
        />
      </div>

      {/* Machine Telemetries Grid */}
      <div className="rounded-2xl border border-white/10 bg-[#0D111D]/90 p-6 shadow-2xl backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-4">Multi-Sensor Drift Breakdown</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 font-mono text-xs">
          <div className="rounded-xl border border-white/5 bg-[#07090F] p-3 text-center">
            <span className="text-gray-400 block mb-1">Temperature</span>
            <span className="text-base font-bold text-cyan-300">{machineData.currentTemp.toFixed(1)}°C</span>
            <span className="text-[10px] text-gray-500 block">Max: {machineData.tempThreshold}°C</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#07090F] p-3 text-center">
            <span className="text-gray-400 block mb-1">Vibration</span>
            <span className="text-base font-bold text-amber-300">{machineData.currentVibration.toFixed(2)} mm/s</span>
            <span className="text-[10px] text-gray-500 block">Max: {machineData.vibrationThreshold} mm/s</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#07090F] p-3 text-center">
            <span className="text-gray-400 block mb-1">Current Draw</span>
            <span className="text-base font-bold text-rose-300">{machineData.currentCurrentDraw.toFixed(1)} A</span>
            <span className="text-[10px] text-gray-500 block">Max: {machineData.currentDrawThreshold} A</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#07090F] p-3 text-center">
            <span className="text-gray-400 block mb-1">Pressure</span>
            <span className="text-base font-bold text-gray-200">{machineData.currentPressure.toFixed(1)} Bar</span>
            <span className="text-[10px] text-gray-500 block">Max: {machineData.pressureThreshold} Bar</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#07090F] p-3 text-center">
            <span className="text-gray-400 block mb-1">Cycle Time</span>
            <span className="text-base font-bold text-gray-200">{machineData.currentCycleTime.toFixed(1)} s</span>
            <span className="text-[10px] text-gray-500 block">Max: {machineData.cycleTimeThreshold} s</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#07090F] p-3 text-center">
            <span className="text-gray-400 block mb-1">Noise Level</span>
            <span className="text-base font-bold text-gray-200">{machineData.currentNoise.toFixed(1)} dB</span>
            <span className="text-[10px] text-gray-500 block">Max: {machineData.noiseThreshold} dB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
