import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatSecondsToCountdown(seconds: number): string {
  if (seconds <= 0) return '00h 00m 00s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 99) return `${Math.floor(hrs / 24)}d ${hrs % 24}h`;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
}

export function getStatusColor(status: 'healthy' | 'drifting' | 'critical' | string) {
  switch (status) {
    case 'healthy':
      return {
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        hex: '#22D3EE',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
      };
    case 'drifting':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        hex: '#F59E0B',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-glow-amber',
      };
    case 'critical':
      return {
        text: 'text-rose-500',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/40',
        hex: '#F43F5E',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        glow: 'shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-glow-red',
      };
    default:
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        hex: '#10B981',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      };
  }
}
