'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Play,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Odometer } from '@/components/ui/Odometer';
import { formatCurrency } from '@/lib/utils';
import { calculateCostOfInaction } from '@/lib/cost-model';

export const LandingHero: React.FC = () => {
  const [daysIgnored, setDaysIgnored] = useState<number>(7);

  // Live calculated exponential cost curve driven by the slider!
  const hoursIgnored = daysIgnored * 24;
  const projectedCost = calculateCostOfInaction(hoursIgnored, {
    downtimeCostPerHr: 18500,
    expectedDowntimeHrs: 12,
    driftVelocity: 0.45,
    repairCost: 3200,
    actedEarlyCost: 650,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090F] text-white">
      {/* Background Hero Mesh & Glowing Drift Line SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-[10%] h-[600px] w-[600px] rounded-full bg-rose-500/10 blur-[140px]" />

        {/* Grid pattern SVG */}
        <svg className="h-full w-full opacity-20" width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />

          {/* Glowing Animated Hero Drift Waveform Line */}
          <path
            d="M 0 350 Q 200 340 400 350 T 800 280 T 1200 150 T 1600 50"
            fill="none"
            stroke="url(#hero-gradient)"
            strokeWidth="4"
            className="drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
          />
          <defs>
            <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>SMART FACTORY predictive PREVENTION ENGINE</span>
          </div>
        </motion.div>

        {/* Main Title & Hero Text */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
          >
            Hear the machine <br />
            <span className="bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 bg-clip-text text-transparent">
              before it screams.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Small drifts — a 0.3°C/hr thermal creep, +4% bearing vibration, or a micro-coolant leak — compound exponentially into catastrophic factory shutdowns.
            <strong className="text-white font-semibold"> Murmur doesn’t send annoying alert spam.</strong> It projects the exact Time-to-Scream, calculates the Cost of Inaction, and delivers a one-click fix.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-8 py-4 font-mono text-base font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="h-5 w-5 fill-slate-950" />
              <span>Launch Live Demo</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/report"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-mono text-sm font-semibold text-gray-200 hover:bg-white/10 hover:text-white transition"
            >
              <span>View ROI Impact Report</span>
            </Link>
          </motion.div>
        </div>

        {/* 3 Labeled Illustrative Stat Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0D111D]/80 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-rose-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Industry Crisis</span>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-white">$50 Billion/yr</p>
            <p className="mt-2 text-xs text-gray-400">
              Lost by global manufacturers to unplanned downtime caused by ignored micro-drifts.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0D111D]/80 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Predictive Lead Time</span>
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-amber-400">14.2 Hours</p>
            <p className="mt-2 text-xs text-gray-400">
              Average early breach notice provided by Murmur before threshold failure occurs.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0D111D]/80 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Financial Efficiency</span>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-emerald-400">18.6x ROI</p>
            <p className="mt-2 text-xs text-gray-400">
              Average return on investment per early micro-intervention vs emergency overhaul.
            </p>
          </div>
        </motion.div>

        {/* Interactive Cost Trajectory Slider Card (Days Ignored: 0 to 30) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-3xl border border-white/10 bg-[#0D111D]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                <TrendingUp className="h-4 w-4" /> Interactive Simulation
              </div>
              <h2 className="text-2xl font-bold text-white">The Cost of Small Problems</h2>
              <p className="text-sm text-gray-400 mt-1">
                Slide to see how ignoring a 0.3°C/hr thermal creep compounds into catastrophic loss.
              </p>
            </div>

            {/* Calculated Cost Display */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-4 text-right shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <span className="text-xs font-mono text-gray-400 block uppercase">Projected Loss If Ignored</span>
              <Odometer value={projectedCost} prefix="$" className="text-3xl sm:text-4xl font-extrabold text-rose-400" />
            </div>
          </div>

          {/* Interactive Slider Input */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-gray-300">Days Ignored:</span>
              <span className="text-2xl font-bold text-cyan-400">{daysIgnored} {daysIgnored === 1 ? 'Day' : 'Days'}</span>
            </div>

            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={daysIgnored}
              onChange={(e) => setDaysIgnored(Number(e.target.value))}
              className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-xs font-mono text-gray-500">
              <span>Day 0 (Acted Early: $650 fix)</span>
              <span>Day 15 (Escalated: ~$140k)</span>
              <span>Day 30 (Shutdown: ~$850k+)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
