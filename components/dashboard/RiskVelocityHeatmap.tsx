'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Clock, AlertTriangle } from 'lucide-react';
import { useMurmurStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { calculateCostOfInaction } from '@/lib/cost-model';

export const RiskVelocityHeatmap: React.FC = () => {
  const { machines, setSelectedMachineId } = useMurmurStore();

  const timeWindows = [
    { label: '+1 Hour', hrs: 1 },
    { label: '+4 Hours', hrs: 4 },
    { label: '+12 Hours', hrs: 12 },
    { label: '+24 Hours', hrs: 24 },
    { label: '+48 Hours', hrs: 48 },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl h-full">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-rose-500" />
          <div>
            <h3 className="font-bold text-white text-base">Risk Velocity Heatmap</h3>
            <p className="text-xs text-gray-400">
              Projected failure escalation trajectory (Machines × Time)
            </p>
          </div>
        </div>
        <span className="font-mono text-xs text-gray-400 hidden sm:inline">
          Matrix updated live
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="py-2 px-3 font-medium">Machine</th>
              <th className="py-2 px-3 font-medium text-center">Breach Metric</th>
              {timeWindows.map((tw) => (
                <th key={tw.hrs} className="py-2 px-3 font-medium text-center">
                  {tw.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {machines.map((machine) => {
              const timeToScreamHrs = machine.timeToScreamSeconds / 3600;

              return (
                <tr
                  key={machine.id}
                  onClick={() => setSelectedMachineId(machine.id)}
                  className="hover:bg-white/5 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          machine.status === 'critical'
                            ? 'bg-rose-500 animate-ping'
                            : machine.status === 'drifting'
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        }`}
                      />
                      {machine.name}
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-center text-gray-300 uppercase">
                    {machine.breachMetric}
                  </td>

                  {timeWindows.map((tw) => {
                    const isBreached = timeToScreamHrs <= tw.hrs;
                    const cost = calculateCostOfInaction(tw.hrs, {
                      downtimeCostPerHr: machine.downtimeCostPerHr,
                      expectedDowntimeHrs: 6,
                      driftVelocity: machine.driftVelocity,
                      repairCost: machine.repairCost,
                      actedEarlyCost: 500,
                    });

                    let cellStyle = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
                    if (isBreached || machine.status === 'critical') {
                      cellStyle = 'bg-rose-500/30 text-rose-300 border-rose-500/40 font-bold animate-pulse';
                    } else if (timeToScreamHrs <= tw.hrs * 1.5 || machine.status === 'drifting') {
                      cellStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                    }

                    return (
                      <td key={tw.hrs} className="py-2.5 px-2 text-center">
                        <div
                          className={`rounded-lg border py-1.5 px-2 text-[11px] shadow-sm transition-all ${cellStyle}`}
                        >
                          {isBreached ? (
                            <span className="flex items-center justify-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-rose-400" />
                              BREACHED
                            </span>
                          ) : (
                            formatCurrency(cost)
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
