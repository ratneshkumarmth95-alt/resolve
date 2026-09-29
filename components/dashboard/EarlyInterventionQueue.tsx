'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Wrench,
  AlertTriangle,
  Clock,
  DollarSign,
  CheckCircle2,
  Filter,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useMurmurStore } from '@/lib/store';
import { formatCurrency, formatSecondsToCountdown, getStatusColor } from '@/lib/utils';
import { InterventionData } from '@/lib/mock-data';

export const EarlyInterventionQueue: React.FC = () => {
  const { interventions, machines, showToast, updateStateFromApi } = useMurmurStore();
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'roi' | 'urgency' | 'cost'>('roi');
  const [executingId, setExecutingId] = useState<string | null>(null);

  // Filter & Sort
  const pendingList = interventions.filter(
    (i) => i.status === 'PENDING' && (filterUrgency === 'ALL' || i.urgency === filterUrgency)
  );

  const sortedList = [...pendingList].sort((a, b) => {
    if (sortBy === 'roi') return b.roi - a.roi;
    if (sortBy === 'cost') return b.projectedCostIfIgnored - a.projectedCostIfIgnored;
    return b.urgency === 'CRITICAL' ? 1 : -1;
  });

  const handleExecute = async (intervention: InterventionData) => {
    setExecutingId(intervention.id);
    try {
      const res = await fetch(`/api/interventions/${intervention.id}/execute`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        // Trigger celebratory confetti burst
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#10B981', '#22D3EE', '#F59E0B'],
          });
        } catch {
          // fallback if canvas not available
        }

        updateStateFromApi(data.state);
        showToast(
          'Intervention Executed!',
          `Averted failure on ${intervention.issueTitle}. Saved ${formatCurrency(
            intervention.projectedCostIfIgnored - intervention.actionCost
          )}!`,
          'success'
        );
      }
    } catch (err) {
      showToast('Execution Failed', 'Failed to submit intervention.', 'amber');
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl h-full">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-white text-base">Early Intervention Queue</h3>
            <p className="text-xs text-gray-400">
              Sorted by ROI & disaster mitigation urgency
            </p>
          </div>
        </div>

        {/* Filter and Sort controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1 rounded-lg bg-[#07090F] p-1 border border-white/10">
            <Filter className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
            {['ALL', 'CRITICAL', 'HIGH'].map((u) => (
              <button
                key={u}
                onClick={() => setFilterUrgency(u)}
                className={`rounded px-2 py-0.5 transition ${
                  filterUrgency === u
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="rounded-lg bg-[#07090F] px-2.5 py-1.5 text-xs text-gray-300 border border-white/10 focus:outline-none focus:border-cyan-500"
          >
            <option value="roi">Sort by ROI</option>
            <option value="cost">Sort by Saved Cost</option>
            <option value="urgency">Sort by Urgency</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1 max-h-[520px]">
        <AnimatePresence>
          {sortedList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center text-gray-400"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
              <p className="font-semibold text-white">All Micro-Problems Mitigated!</p>
              <p className="text-xs text-gray-500 max-w-sm mt-1">
                No pending high-risk interventions. Inject a fault via Chaos Mode to simulate a new problem.
              </p>
            </motion.div>
          ) : (
            sortedList.map((item) => {
              const machine = machines.find((m) => m.id === item.machineId);
              const countdown = machine ? machine.timeToScreamSeconds : 5400;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111625]/80 p-4 transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group"
                >
                  {/* Top line info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border ${
                          item.urgency === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {item.urgency}
                      </span>

                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                        {item.issueTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <Clock className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                      <span className="text-gray-400">Time-to-Scream:</span>
                      <span className="font-bold text-rose-400">
                        {formatSecondsToCountdown(countdown)}
                      </span>
                    </div>
                  </div>

                  {/* Body description & Predictive Sparkline SVG */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Mini Metrics Row */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-gray-500">Fix Cost: </span>
                          <span className="text-gray-200 font-bold">{formatCurrency(item.actionCost)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ignored Cost: </span>
                          <span className="text-rose-400 font-bold">{formatCurrency(item.projectedCostIfIgnored)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">ROI: </span>
                          <span className="text-emerald-400 font-bold">+{item.roi}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Predictive Sparkline SVG (Normal Band vs Divergence) */}
                    <div className="relative rounded-lg border border-white/5 bg-[#07090F] p-2 flex flex-col justify-center">
                      <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                        <span>Predictive Divergence</span>
                        <span className="text-cyan-400 font-bold">96.4% Conf</span>
                      </div>
                      <svg viewBox="0 0 120 40" className="w-full h-10 stroke-current overflow-visible">
                        {/* Normal band shaded */}
                        <path
                          d="M 0 25 Q 30 24 60 25 T 120 25 L 120 32 L 0 32 Z"
                          fill="rgba(34, 211, 238, 0.1)"
                        />
                        {/* Normal baseline */}
                        <path
                          d="M 0 28 Q 30 27 60 28 T 120 28"
                          fill="none"
                          stroke="#22D3EE"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        {/* Injected Red Divergence Curve */}
                        <path
                          d="M 0 28 Q 40 27 60 20 T 120 4"
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="2.5"
                        />
                        <circle cx="120" cy="4" r="3" fill="#F43F5E" className="animate-ping" />
                      </svg>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> Direct One-Click Prevention
                    </span>

                    <button
                      onClick={() => handleExecute(item)}
                      disabled={executingId === item.id}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {executingId === item.id ? (
                        <span>Executing...</span>
                      ) : (
                        <>
                          <span>{item.actionType}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
