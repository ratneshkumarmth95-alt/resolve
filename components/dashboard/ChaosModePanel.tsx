'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, Gauge, AlertTriangle, ShieldCheck, Play } from 'lucide-react';
import { useMurmurStore } from '@/lib/store';
import { SpeedFactor } from '@/lib/engine';

export const ChaosModePanel: React.FC = () => {
  const { machines, speedFactor, setSpeedFactor, showToast, updateStateFromApi } = useMurmurStore();

  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [selectedFault, setSelectedFault] = useState<string>('bearing_wear');
  const [isInjecting, setIsInjecting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const faultTypes = [
    { id: 'bearing_wear', label: 'Bearing Thermal Creep (+1.45/hr drift)' },
    { id: 'coolant_leak', label: 'Coolant Micro-Leakage (+1.85°C/hr drift)' },
    { id: 'voltage_spike', label: 'Inverter Current Draw Spike (+2.10A/hr)' },
    { id: 'cavitation', label: 'Hydraulic Valve Cavitation (+0.95Bar/hr)' },
  ];

  const handleInject = async () => {
    const targetId = selectedMachineId || machines[0]?.id;
    if (!targetId) return;

    setIsInjecting(true);
    try {
      const res = await fetch('/api/simulate/fault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: targetId,
          faultType: selectedFault,
          speedFactor,
        }),
      });
      const data = await res.json();

      if (data.success) {
        updateStateFromApi(data.state);
        showToast(
          'Micro-Fault Injected!',
          `Injected ${selectedFault} into ${data.machine.name}. Watch Time-to-Scream countdown begin!`,
          'amber'
        );
      }
    } catch (err) {
      showToast('Error', 'Failed to inject micro-fault', 'amber');
    } finally {
      setIsInjecting(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/simulate/reset', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        updateStateFromApi(data.state);
        showToast('Factory Reset', 'All machine telemetries restored to nominal baseline.', 'info');
      }
    } catch (err) {
      showToast('Error', 'Failed to reset simulation', 'amber');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSpeedChange = async (speed: SpeedFactor) => {
    setSpeedFactor(speed);
    // Submit speed factor to simulation API
    fetch('/api/simulate/fault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machineId: machines[0]?.id || 'mach-01',
        faultType: machines[0]?.activeFault || 'bearing_wear',
        speedFactor: speed,
      }),
    });
  };

  return (
    <div className="relative flex flex-col rounded-2xl border border-rose-500/30 bg-[#0D111D]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400 border border-rose-500/30 animate-pulse">
            <Zap className="h-5 w-5 fill-rose-400/20" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Chaos Mode (Judge Simulation Panel)</h3>
            <p className="text-xs text-gray-400">
              Inject synthetic micro-drift faults and accelerate time
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-gray-300 hover:bg-white/10 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          Reset Factory Baseline
        </button>
      </div>

      {/* Controls Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Machine Selector */}
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">Target Machine</label>
          <select
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="w-full rounded-xl bg-[#07090F] p-2.5 text-xs font-mono text-gray-200 border border-white/10 focus:border-rose-500 focus:outline-none"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.location}) - {m.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Fault Type Selector */}
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">Synthetic Micro-Fault Type</label>
          <select
            value={selectedFault}
            onChange={(e) => setSelectedFault(e.target.value)}
            className="w-full rounded-xl bg-[#07090F] p-2.5 text-xs font-mono text-gray-200 border border-white/10 focus:border-rose-500 focus:outline-none"
          >
            {faultTypes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Speed Control (1x / 10x / 60x) */}
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">Simulation Speed</label>
          <div className="flex rounded-xl bg-[#07090F] p-1 border border-white/10 font-mono text-xs">
            {([1, 10, 60] as SpeedFactor[]).map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`flex-1 rounded-lg py-1.5 font-bold transition ${
                  speedFactor === s
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <p className="text-[11px] font-mono text-gray-400">
          💡 Click to force a drift fault. Watch the Time-to-Scream countdown begin immediately!
        </p>

        <button
          onClick={handleInject}
          disabled={isInjecting}
          className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-95 transition-all disabled:opacity-50"
        >
          {isInjecting ? (
            <span>Injecting...</span>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4" />
              <span>Inject Micro-Fault</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
