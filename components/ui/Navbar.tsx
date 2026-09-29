'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutDashboard, FileText, Zap, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Landing', href: '/', icon: Activity },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Impact Report', href: '/report', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07090F]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Zap className="h-5 w-5 fill-cyan-400/20 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white">MURMUR</span>
              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                PROACTIVE AI
              </span>
            </div>
            <p className="text-[10px] text-gray-400 tracking-tight hidden sm:block">
              Predictive Cost Prevention
            </p>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Demo Mode Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
          <ShieldAlert className="h-3.5 w-3.5 animate-pulse text-rose-400" />
          <span className="font-mono">BUILD THE FUTURE PS04</span>
        </div>
      </div>
    </header>
  );
};
