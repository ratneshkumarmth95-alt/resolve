'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';
import { generateGhostTimelineData, CostModelParams } from '@/lib/cost-model';
import { formatCurrency } from '@/lib/utils';

interface GhostTimelineProps {
  params: CostModelParams;
}

export const GhostTimeline: React.FC<GhostTimelineProps> = ({ params }) => {
  const data = generateGhostTimelineData(params, 48, 2);

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-white text-base">Ghost Timeline (Cost Trajectory)</h3>
            <p className="text-xs text-gray-400">
              Split-view: Exponential Cost if Ignored vs Flat Cost if Acted Early
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> If Ignored (Exponential)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> If Acted Now (Fixed)
          </span>
        </div>
      </div>

      <div className="mt-4 flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIgnored" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorActed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="timeLabel" stroke="#9CA3AF" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const ignored = payload[0]?.value as number;
                  const acted = payload[1]?.value as number;
                  const saved = ignored - acted;

                  return (
                    <div className="rounded-xl border border-white/10 bg-[#0D111D] p-3 text-xs font-mono text-white shadow-2xl backdrop-blur-md">
                      <p className="font-bold text-cyan-300 border-b border-white/10 pb-1 mb-2">
                        Time Horizon: {label}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4 text-rose-400">
                          <span>Cost If Ignored:</span>
                          <span className="font-bold">{formatCurrency(ignored)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-emerald-400">
                          <span>Cost If Acted Now:</span>
                          <span className="font-bold">{formatCurrency(acted)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-cyan-300 border-t border-white/10 pt-1 mt-1 font-bold">
                          <span>Net Money Saved:</span>
                          <span>{formatCurrency(saved)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="ignoredCost"
              name="Cost If Ignored"
              stroke="#F43F5E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIgnored)"
            />
            <Area
              type="monotone"
              dataKey="actedCost"
              name="Cost If Acted Now"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActed)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
