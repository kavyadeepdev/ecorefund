import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface StatCounterProps {
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

export default function StatCounter({ label, value, suffix = '', description }: StatCounterProps) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1400;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCurrentValue(Math.round(value * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-white/95 border border-slate-200/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
    >
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500 font-semibold mb-3">{label}</p>
      <div className="text-4xl md:text-5xl font-display font-bold text-slate-900">
        {currentValue.toLocaleString()}
        <span className="text-brand-600">{suffix}</span>
      </div>
      <p className="mt-4 text-sm text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
