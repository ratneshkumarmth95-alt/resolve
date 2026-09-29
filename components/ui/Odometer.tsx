'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface OdometerProps {
  value: number;
  prefix?: string;
  className?: string;
}

export const Odometer: React.FC<OdometerProps> = ({
  value,
  prefix = '$',
  className = '',
}) => {
  const animatedValue = useSpring(value, {
    stiffness: 80,
    damping: 20,
    mass: 0.8,
  });

  useEffect(() => {
    animatedValue.set(value);
  }, [value, animatedValue]);

  const displayValue = useTransform(animatedValue, (current) => {
    return Math.round(current).toLocaleString('en-US');
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>{prefix}{value.toLocaleString('en-US')}</span>;
  }

  return (
    <span className={`font-mono tabular-nums tracking-tight ${className}`}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
    </span>
  );
};
