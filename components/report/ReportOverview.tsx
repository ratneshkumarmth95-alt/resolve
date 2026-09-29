'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Printer,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useMurmurStore } from '@/lib/store';

export const ReportOverview: React.FC = () => {
  const { totalSavedDollars, totalHoursPreserved, failuresAverted, interventions } = useMurmurStore();
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/report')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReportData(data);
      });
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const monthlyChartData = reportData?.monthlySavings || [
    { month: 'May', dollarsSaved: 42000 },
    { month: 'Jun', dollarsSaved: 68000 },
    { month: 'Jul', dollarsSaved: 95000 },
    { month: 'Aug', dollarsSaved: 114000 },
    { month: 'Sep', dollarsSaved: totalSavedDollars },
  ];

  return (
    <div className="space-y-8 print:p-0">
      {/* Header section with Print PDF button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <FileText className="h-4 w-4" /> Operational Executive Summary
          </div>
          <h1 className="text-3xl font-extrabold text-white">Murmur Impact & ROI Report</h1>
          <p className="text-sm text-gray-400 mt-1">
            Audited financial breakdown of micro-interventions vs emergency downtime
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-5 py-2.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition shadow-[0_0_15px_rgba(34,211,238,0.2)] print:hidden"
        >
          <Printer className="h-4 w-4" />
          <span>Export PDF / Print Report</span>
        </button>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono text-emerald-400 uppercase">Total Net Dollars Saved</span>
          <p className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
            {formatCurrency(totalSavedDollars)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Direct breakdown of averted damage</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono text-cyan-400 uppercase">Production Hours Preserved</span>
          <p className="text-3xl font-extrabold font-mono text-cyan-300 mt-2">
            {totalHoursPreserved} Hours
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Prevented factory line stalls</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono text-amber-400 uppercase">Catastrophic Failures Averted</span>
          <p className="text-3xl font-extrabold font-mono text-amber-300 mt-2">
            {failuresAverted} Incidents
          </p>
          <p className="text-[11px] text-gray-400 mt-1">100% caught before breach</p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono text-purple-400 uppercase">Intervention ROI Multiple</span>
          <p className="text-3xl font-extrabold font-mono text-purple-300 mt-2">
            14.8x ROI
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Return on early service cost</p>
        </div>
      </div>

      {/* Cumulative Savings Area Chart */}
      <div className="rounded-2xl border border-white/10 bg-[#0D111D]/90 p-6 shadow-2xl backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-1">Cumulative Net Savings Over Time</h3>
        <p className="text-xs text-gray-400 mb-4">
          Financial growth trajectory resulting from continuous proactive drift mitigation
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyChartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D111D',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(val: any) => [formatCurrency(val), 'Net Saved']}
              />
              <Area type="monotone" dataKey="dollarsSaved" stroke="#10B981" strokeWidth={3} fill="url(#reportGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Interventions Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0D111D]/90 p-6 shadow-2xl backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-1">Top Preventative Interventions Audit Log</h3>
        <p className="text-xs text-gray-400 mb-4">
          Detailed log of micro-faults detected, action costs, and financial impact
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-3 px-4 font-medium">Issue Detected</th>
                <th className="py-3 px-4 font-medium">Action Taken</th>
                <th className="py-3 px-4 font-medium">Fix Cost</th>
                <th className="py-3 px-4 font-medium">Prevented Downtime Cost</th>
                <th className="py-3 px-4 font-medium">Net Savings</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {interventions.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition">
                  <td className="py-3 px-4 font-bold text-white">{item.issueTitle}</td>
                  <td className="py-3 px-4 text-cyan-300">{item.actionType}</td>
                  <td className="py-3 px-4 text-gray-300">{formatCurrency(item.actionCost)}</td>
                  <td className="py-3 px-4 text-rose-400">{formatCurrency(item.projectedCostIfIgnored)}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    {formatCurrency(item.projectedCostIfIgnored - item.actionCost)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        item.status === 'EXECUTED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
