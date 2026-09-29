'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useMurmurStore } from '@/lib/store';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useMurmurStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0D111D]/90 p-4 shadow-2xl backdrop-blur-md text-white min-w-[320px]"
        >
          {toastMessage.type === 'success' && (
            <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          {toastMessage.type === 'amber' && (
            <div className="rounded-full bg-amber-500/20 p-2 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          {toastMessage.type === 'info' && (
            <div className="rounded-full bg-cyan-500/20 p-2 text-cyan-400 border border-cyan-500/30">
              <Info className="h-5 w-5" />
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-100">{toastMessage.title}</h4>
            <p className="text-xs text-gray-400">{toastMessage.desc}</p>
          </div>

          <button
            onClick={clearToast}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
