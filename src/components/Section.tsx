import React from 'react';
import { motion } from 'motion/react';

interface SectionProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export default function Section({ id, title, icon: Icon, children }: SectionProps) {
  return (
    <motion.section 
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-32"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-brand-100 text-brand-700 p-3 rounded-2xl">
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
