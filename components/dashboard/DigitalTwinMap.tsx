'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, AlertTriangle, ShieldCheck, Zap, ArrowRight, Activity, Thermometer, Radio } from 'lucide-react';
import { useMurmurStore } from '@/lib/store';
import { MachineData } from '@/lib/mock-data';
import { formatSecondsToCountdown, getStatusColor } from '@/lib/utils';

export const DigitalTwinMap: React.FC = () => {
  const { machines, selectedMachineId, setSelectedMachineId } = useMurmurStore();
  const [hoveredMachine, setHoveredMachine] = useState<MachineData | null>(null);

  const activeMachine = hoveredMachine || machines.find((m) => m.id === selectedMachineId);

  return (
    <div className="relative flex flex-col rounded-2xl border border-white/10 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl h-full min-h-[460px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-white text-base">Digital Twin Floor Map</h3>
            <p className="text-xs text-gray-400">
              Live telemetry glowing green → amber → red by drift velocity
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" /> Healthy
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" /> Drifting
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E] animate-ping" /> Critical Breach
          </span>
        </div>
      </div>

      {/* Main Floor Blueprint SVG Container */}
      <div className="relative mt-4 flex-1 rounded-xl border border-white/5 bg-[#07090F] overflow-hidden min-h-[340px]">
        {/* Architectural Grid Pattern */}
        <svg className="absolute inset-0 h-full w-full stroke-white/5" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Zones Outline */}
          <rect x="5%" y="10%" width="40%" height="38%" rx="10" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
          <text x="7%" y="16%" fill="#22D3EE" fontSize="10" fontFamily="monospace" opacity="0.6">ZONE A: MILLING & PNEUMATICS</text>

          <rect x="50%" y="10%" width="45%" height="38%" rx="10" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
          <text x="52%" y="16%" fill="#F59E0B" fontSize="10" fontFamily="monospace" opacity="0.6">ZONE B: STAMPING & PLASTICS</text>

          <rect x="5%" y="54%" width="40%" height="40%" rx="10" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
          <text x="7%" y="60%" fill="#10B981" fontSize="10" fontFamily="monospace" opacity="0.6">ZONE C: THERMAL & COOLING</text>

          <rect x="50%" y="54%" width="45%" height="40%" rx="10" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
          <text x="52%" y="60%" fill="#8B5CF6" fontSize="10" fontFamily="monospace" opacity="0.6">ZONE D: ROBOTICS & LOGISTICS</text>
        </svg>

        {/* Machine Nodes on Floor Map */}
        {machines.map((machine) => {
          const colors = getStatusColor(machine.status);
          const isSelected = selectedMachineId === machine.id;

          // Pulse scale based on drift velocity
          const pulseDuration = Math.max(0.6, 2.5 - machine.driftVelocity * 1.2);

          return (
            <div
              key={machine.id}
              style={{ left: `${machine.posX}%`, top: `${machine.posY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10"
              onMouseEnter={() => setHoveredMachine(machine)}
              onMouseLeave={() => setHoveredMachine(null)}
              onClick={() => setSelectedMachineId(machine.id)}
            >
              {/* Outer pulsing aura */}
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: pulseDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`absolute inset-0 rounded-full ${colors.bg}`}
              />

              {/* Machine Marker Card */}
              <div
                className={`relative flex items-center gap-2 rounded-xl border px-3 py-2 backdrop-blur-md transition-all shadow-xl ${
                  colors.border
                } ${colors.bg} ${
                  isSelected ? 'ring-2 ring-cyan-400 scale-105' : 'hover:scale-105'
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${colors.bg} border ${colors.border}`}>
                  <div className={`h-full w-full rounded-full ${colors.badge}`} />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-white whitespace-nowrap">
                      {machine.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <span>V: +{machine.driftVelocity.toFixed(2)}/h</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Active Machine Quick Popover card overlay */}
        <AnimatePresence>
          {activeMachine && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 z-30 rounded-xl border border-white/10 bg-[#0D111D]/95 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-4 sm:w-80"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-white">{activeMachine.name}</h4>
                  <p className="text-[11px] text-gray-400">{activeMachine.type} • {activeMachine.location}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono border ${getStatusColor(activeMachine.status).badge}`}>
                  {activeMachine.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Time-to-Scream:</span>
                  <span className={`font-bold ${activeMachine.status === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {formatSecondsToCountdown(activeMachine.timeToScreamSeconds)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Breach Metric:</span>
                  <span className="text-cyan-300 uppercase">{activeMachine.breachMetric}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Drift Velocity:</span>
                  <span className="text-rose-400">+{activeMachine.driftVelocity.toFixed(2)} / hr</span>
                </div>

                {activeMachine.activeFault && (
                  <div className="mt-2 rounded-lg bg-rose-500/10 p-2 border border-rose-500/20 text-rose-300 text-[11px]">
                    <span className="font-bold">Fault:</span> {activeMachine.activeFault}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex justify-end">
                <Link
                  href={`/machines/${activeMachine.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                >
                  View Full Waveform & Ghost Timeline <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
