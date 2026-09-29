'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingDown, DollarSign, Clock, Zap, Info } from 'lucide-react';
import { Odometer } from '@/components/ui/Odometer';
import { useMurmurStore, Timeframe } from '@/lib/store';
import { COST_FORMULA_EXPLANATION } from '@/lib/cost-model';

export const CostOfInactionTicker: React.FC = () => {
  const {
    timeframe,
    setTimeframe,
    earlyActionToggle,
    setEarlyActionToggle,
    totalSavedDollars,
    totalHoursPreserved,
    machines,
    interventions,
  } = useMurmurStore();

  // Calculate unmitigated cost of inaction based on timeframe & pending interventions
  const pendingCost = interventions
    .filter((i) => i.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.projectedCostIfIgnored, 0);

  const multiplier = timeframe === '24h' ? 1 : timeframe === '7d' ? 3.8 : 14.2;

  const rawIgnoredCost = Math.round((pendingCost || 586000) * multiplier);
  const rawActedCost = Math.round(totalSavedDollars * (timeframe === '24h' ? 0.35 : timeframe === '7d' ? 0.75 : 1.0));

  const displayCost = earlyActionToggle ? rawActedCost : rawIgnoredCost;
  const criticalCount = machines.filter((m) => m.status === 'critical').length;
  const driftingCount = machines.filter((m) => m.status === 'drifting').length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-500">
      {/* Dynamic Glow Background according to toggle */}
      <div
        className={`absolute inset-0 opacity-15 transition-opacity duration-700 pointer-events-none ${
          earlyActionToggle
            ? 'bg-radial from-emerald-500/40 via-transparent to-transparent'
            : 'bg-radial from-rose-500/40 via-transparent to-transparent'
        }`}
      />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Ticker section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${
                earlyActionToggle
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              }`}
            >
              {earlyActionToggle ? (
                <TrendingDown className="h-6 w-6" />
              ) : (
                <ShieldAlert className="h-6 w-6 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {earlyActionToggle ? 'Projected Net Savings' : 'Live Cost of Inaction'}
                </span>
                <div className="group relative">
                  <Info className="h-3.5 w-3.5 text-gray-500 hover:text-cyan-400 cursor-pointer" />
                  <div className="absolute left-0 top-6 hidden group-hover:block z-50 w-72 rounded-lg border border-white/10 bg-[#111625] p-3 text-xs text-gray-300 shadow-xl backdrop-blur-md">
                    <p className="font-mono text-[11px] whitespace-pre-line text-cyan-300">
                      {COST_FORMULA_EXPLANATION}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <Odometer
                  value={displayCost}
                  prefix="$"
                  className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                    earlyActionToggle ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                />
                <span className="text-xs font-mono text-gray-400">
                  /{timeframe}
                </span>
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block mx-2" />

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 border border-white/5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-400 font-bold">{criticalCount}</span>
              <span className="text-gray-400">Critical</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 border border-white/5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-amber-400 font-bold">{driftingCount}</span>
              <span className="text-gray-400">Drifting</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 border border-white/5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-bold">{totalHoursPreserved}h</span>
              <span className="text-gray-400">Preserved</span>
            </div>
          </div>
        </div>

        {/* Controls section: Timeframe Selector & Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 24h / 7d / 30d selector */}
          <div className="flex rounded-lg bg-[#07090F] p-1 border border-white/10 text-xs font-mono">
            {(['24h', '7d', '30d'] as Timeframe[]).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`rounded-md px-3 py-1 font-medium transition-all ${
                  timeframe === t
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Toggle "Without Early Action" vs "With Early Action" */}
          <div
            onClick={() => setEarlyActionToggle(!earlyActionToggle)}
            className="flex cursor-pointer items-center rounded-full border border-white/10 bg-[#07090F] p-1 shadow-inner text-xs font-mono transition-all"
          >
            <motion.div
              className={`rounded-full px-3 py-1 font-semibold transition-all ${
                !earlyActionToggle
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                  : 'text-gray-400'
              }`}
            >
              Without Early Action
            </motion.div>
            <motion.div
              className={`rounded-full px-3 py-1 font-semibold transition-all ${
                earlyActionToggle
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'text-gray-400'
              }`}
            >
              With Early Action
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
