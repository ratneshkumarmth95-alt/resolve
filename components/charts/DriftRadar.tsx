'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Activity, ShieldAlert } from 'lucide-react';
import { useMurmurStore } from '@/lib/store';

export const DriftRadar: React.FC = () => {
  const { machines, selectedMachineId } = useMurmurStore();

  const targetMachine =
    machines.find((m) => m.id === selectedMachineId) ||
    machines.find((m) => m.status === 'critical') ||
    machines[0];

  if (!targetMachine) return null;

  // Normalize sensor values 0-100 relative to threshold
  const radarData = [
    {
      metric: 'Temp',
      current: Math.min(100, Math.round((targetMachine.currentTemp / targetMachine.tempThreshold) * 100)),
      threshold: 100,
    },
    {
      metric: 'Vibration',
      current: Math.min(100, Math.round((targetMachine.currentVibration / targetMachine.vibrationThreshold) * 100)),
      threshold: 100,
    },
    {
      metric: 'Current Draw',
      current: Math.min(100, Math.round((targetMachine.currentCurrentDraw / targetMachine.currentDrawThreshold) * 100)),
      threshold: 100,
    },
    {
      metric: 'Pressure',
      current: Math.min(100, Math.round((targetMachine.currentPressure / targetMachine.pressureThreshold) * 100)),
      threshold: 100,
    },
    {
      metric: 'Cycle Time',
      current: Math.min(100, Math.round((targetMachine.currentCycleTime / targetMachine.cycleTimeThreshold) * 100)),
      threshold: 100,
    },
    {
      metric: 'Noise',
      current: Math.min(100, Math.round((targetMachine.currentNoise / targetMachine.noiseThreshold) * 100)),
      threshold: 100,
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-white text-base">Drift Velocity Radar</h3>
            <p className="text-xs text-gray-400">
              {targetMachine.name} (% of threshold)
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] text-amber-300 border border-amber-500/30">
          V: +{targetMachine.driftVelocity.toFixed(2)}/h
        </span>
      </div>

      <div className="relative mt-2 flex-1 w-full min-h-[260px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" />
            
            <Radar
              name="Breach Limit"
              dataKey="threshold"
              stroke="#F43F5E"
              fill="#F43F5E"
              fillOpacity={0.08}
              strokeDasharray="3 3"
            />
            <Radar
              name="Current Drift"
              dataKey="current"
              stroke={targetMachine.status === 'critical' ? '#F43F5E' : '#F59E0B'}
              fill={targetMachine.status === 'critical' ? '#F43F5E' : '#F59E0B'}
              fillOpacity={0.45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D111D',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val}% of limit`, 'Value']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
