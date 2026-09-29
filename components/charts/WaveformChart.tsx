'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity } from 'lucide-react';
import { getStatusColor } from '@/lib/utils';

interface WaveformProps {
  readings: Array<{
    timestamp: number;
    temp: number;
    vibration: number;
    currentDraw: number;
    pressure: number;
    cycleTime: number;
    noise: number;
  }>;
  metric: 'temp' | 'vibration' | 'currentDraw' | 'pressure' | 'cycleTime' | 'noise';
  threshold: number;
  status: string;
}

export const WaveformChart: React.FC<WaveformProps> = ({
  readings,
  metric,
  threshold,
  status,
}) => {
  const chartData = readings.map((r, idx) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    val: r[metric],
    threshold,
  }));

  const colors = getStatusColor(status);

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
          <div>
            <h3 className="font-bold text-white text-base">Live Sensor Telemetry</h3>
            <p className="text-xs text-gray-400 capitalize">
              Metric: {metric} (Breach Limit: {threshold})
            </p>
          </div>
        </div>

        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] border ${colors.badge}`}>
          LIVE SSE STREAM
        </span>
      </div>

      <div className="mt-4 flex-1 w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={['auto', 'auto']} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0D111D',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />

            <ReferenceLine
              y={threshold}
              label={{ value: 'THREHOLD BREACH', fill: '#F43F5E', fontSize: 10, position: 'top' }}
              stroke="#F43F5E"
              strokeDasharray="4 4"
            />

            <Line
              type="monotone"
              dataKey="val"
              name={metric.toUpperCase()}
              stroke={colors.hex}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: colors.hex }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
