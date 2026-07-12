import React from 'react';
import { motion } from 'motion/react';

export default function InteractiveModel() {
  return (
    <div className="model-scene">
      <motion.div
        whileHover={{ rotateY: 22, rotateX: 8, scale: 1.02 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="model-core"
      >
        <div className="model-globe" />
        <div className="model-ring ring-small" />
        <div className="model-ring ring-medium" />
        <div className="model-ring ring-large" />
        <div className="model-node node-top" />
        <div className="model-node node-right" />
        <div className="model-node node-left" />
      </motion.div>
    </div>
  );
}
