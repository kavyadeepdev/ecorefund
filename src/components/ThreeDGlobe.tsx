import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Activity, HelpCircle } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

interface Hub {
  name: string;
  theta: number; // angle from top pole (0 to PI)
  phi: number;   // angle around equator (0 to 2*PI)
  rvms: number;
  volume: string;
  payouts: string;
  co2: string;
}

const HUBS: Hub[] = [
  { name: 'Mumbai Metro', theta: 1.82, phi: 1.25, rvms: 78, volume: '412 Tons', payouts: '₹8.24 Lakhs', co2: '24,500 kg' },
  { name: 'Delhi NCR', theta: 1.45, phi: 1.38, rvms: 112, volume: '628 Tons', payouts: '₹12.56 Lakhs', co2: '38,200 kg' },
  { name: 'Bengaluru Tech', theta: 2.05, phi: 1.45, rvms: 64, volume: '345 Tons', payouts: '₹6.90 Lakhs', co2: '21,100 kg' },
  { name: 'Chennai Central', theta: 2.02, phi: 1.68, rvms: 42, volume: '218 Tons', payouts: '₹4.36 Lakhs', co2: '13,000 kg' },
  { name: 'Kolkata Hub', theta: 1.71, phi: 1.88, rvms: 38, volume: '185 Tons', payouts: '₹3.70 Lakhs', co2: '11,200 kg' },
];

export default function ThreeDGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Globe rotation states
  const rotationRef = useRef({ x: 0.3, y: 0.0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });

  // Hover states
  const [hoveredHub, setHoveredHub] = useState<Hub | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  
  // Parallax tilt from mouse movement outside dragging
  const mouseTilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Handle resizing
    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Keep canvas square based on container width
      const size = Math.min(rect.width, 540);
      canvas.width = size * window.devicePixelRatio;
      canvas.height = size * window.devicePixelRatio;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      width = canvas.width;
      height = canvas.height;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Generate globe particles
    const particleCount = 750;
    const particles: Point3D[] = [];
    const radius = 175; // radius of sphere in 3D space

    // Fibonacci sphere packing for even distribution
    const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // golden angle in radians

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      particles.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseX: x * radius,
        baseY: y * radius,
        baseZ: z * radius,
      });
    }

    const focalLength = 380;
    const centerX = () => canvas.width / (2 * window.devicePixelRatio);
    const centerY = () => canvas.height / (2 * window.devicePixelRatio);

    // Main animation loop
    const tick = () => {
      // Auto-rotation when not dragging
      if (!isDragging.current) {
        rotationRef.current.y += 0.003;
      }

      ctx.clearRect(0, 0, width, height);

      const rotX = rotationRef.current.x + mouseTilt.current.x * 0.1;
      const rotY = rotationRef.current.y + mouseTilt.current.y * 0.1;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // We'll store all projected items to draw them in Z-sorted order
      const drawList: Array<{
        type: 'particle' | 'hub';
        projX: number;
        projY: number;
        projZ: number;
        original?: any;
      }> = [];

      // Project Globe Particles
      particles.forEach((p) => {
        // Rotate around Y axis
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseX * sinY + p.baseZ * cosY;

        // Rotate around X axis
        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = p.baseY * sinX + z1 * cosX;

        // Projection
        const scale = focalLength / (focalLength + z2);
        const projX = centerX() + x1 * scale;
        const projY = centerY() + y2 * scale;

        drawList.push({
          type: 'particle',
          projX,
          projY,
          projZ: z2,
        });
      });

      // Project Hubs
      const projectedHubs: Array<{ hub: Hub; px: number; py: number; pz: number }> = [];

      HUBS.forEach((hub) => {
        // Convert spherical coords to Cartesian
        const hx = radius * Math.sin(hub.theta) * Math.cos(hub.phi);
        const hy = radius * Math.cos(hub.theta);
        const hz = radius * Math.sin(hub.theta) * Math.sin(hub.phi);

        // Rotate around Y axis
        let x1 = hx * cosY - hz * sinY;
        let z1 = hx * sinY + hz * cosY;

        // Rotate around X axis
        let y2 = hy * cosX - z1 * sinX;
        let z2 = hy * sinX + z1 * cosX;

        // Projection
        const scale = focalLength / (focalLength + z2);
        const projX = centerX() + x1 * scale;
        const projY = centerY() + y2 * scale;

        const pHub = { hub, px: projX, py: projY, pz: z2 };
        projectedHubs.push(pHub);

        drawList.push({
          type: 'hub',
          projX,
          projY,
          projZ: z2,
          original: pHub,
        });
      });

      // Z-Sorting (Painters Algorithm: draw furthest (high Z) first)
      drawList.sort((a, b) => b.projZ - a.projZ);

      // Draw everything
      drawList.forEach((item) => {
        // Opacity based on depth
        // z2 ranges from -radius to +radius
        const alpha = Math.max(0.08, 1 - (item.projZ + radius) / (2 * radius));

        if (item.type === 'particle') {
          ctx.beginPath();
          const size = Math.max(0.6, (1.8 * (radius * 1.5 - item.projZ)) / (radius * 2));
          ctx.arc(item.projX, item.projY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.7})`;
          ctx.fill();
        } else if (item.type === 'hub') {
          const { hub, px, py, pz } = item.original;

          // Only draw hubs in the front half (Z < 40) for visual clarity
          if (pz < 110) {
            const isHovered = hoveredHub?.name === hub.name;
            const size = isHovered ? 8 : 5;

            // Draw glowing outer ring
            ctx.beginPath();
            ctx.arc(px, py, size * 2.4, 0, Math.PI * 2);
            ctx.fillStyle = isHovered 
              ? `rgba(34, 197, 94, 0.25)` 
              : `rgba(6, 182, 212, 0.15)`;
            ctx.fill();

            // Draw inner node
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = isHovered ? '#22c55e' : '#06b6d4';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.fill();
            ctx.stroke();

            // Draw name label slightly above
            ctx.font = 'bold 9px "Space Grotesk", sans-serif';
            ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'center';
            ctx.fillText(hub.name, px, py - size - 6);
          }
        }
      });

      // Update hovered hub location
      if (hoveredHub) {
        const matchingProjected = projectedHubs.find(ph => ph.hub.name === hoveredHub.name);
        if (matchingProjected && matchingProjected.pz < 110) {
          setHoverPos({ x: matchingProjected.px, y: matchingProjected.py });
        } else {
          // If rotated to the back, hide tooltip
          setHoveredHub(null);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [hoveredHub]);

  // Global window listeners for drag & touch rotation
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      
      // Update rotation based on drag (slightly increased sensitivity to 0.006)
      rotationRef.current.y = rotationStart.current.y + deltaX * 0.006;
      rotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationStart.current.x + deltaY * 0.006));
    };

    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.current.x;
      const deltaY = touch.clientY - dragStart.current.y;
      
      rotationRef.current.y = rotationStart.current.y + deltaX * 0.006;
      rotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationStart.current.x + deltaY * 0.006));
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  // Handle Dragging / Rotating globe with Mouse/Touch
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotationStart.current = { x: rotationRef.current.x, y: rotationRef.current.y };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    rotationStart.current = { x: rotationRef.current.x, y: rotationRef.current.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (!isDragging.current) {
      // Parallax mouse tilt
      const xPercent = (clientX / rect.width) - 0.5;
      const yPercent = (clientY / rect.height) - 0.5;
      mouseTilt.current = { x: yPercent, y: xPercent };

      // Check collision with nodes
      const cosX = Math.cos(rotationRef.current.x + mouseTilt.current.x * 0.1);
      const sinX = Math.sin(rotationRef.current.x + mouseTilt.current.x * 0.1);
      const cosY = Math.cos(rotationRef.current.y + mouseTilt.current.y * 0.1);
      const sinY = Math.sin(rotationRef.current.y + mouseTilt.current.y * 0.1);

      const radius = 175;
      const focalLength = 380;
      const cX = rect.width / 2;
      const cY = rect.height / 2;
      let closestHub: Hub | null = null;
      let minDistance = 20; // 20px threshold

      HUBS.forEach((hub) => {
        const hx = radius * Math.sin(hub.theta) * Math.cos(hub.phi);
        const hy = radius * Math.cos(hub.theta);
        const hz = radius * Math.sin(hub.theta) * Math.sin(hub.phi);

        // Rotate
        let x1 = hx * cosY - hz * sinY;
        let z1 = hx * sinY + hz * cosY;
        let y2 = hy * cosX - z1 * sinX;
        let z2 = hy * sinX + z1 * cosX;

        // Front hemisphere check only
        if (z2 < 110) {
          const scale = focalLength / (focalLength + z2);
          const px = cX + x1 * scale;
          const py = cY + y2 * scale;

          const dist = Math.hypot(clientX - px, clientY - py);
          if (dist < minDistance) {
            minDistance = dist;
            closestHub = hub;
            setHoverPos({ x: px, y: py });
          }
        }
      });

      if (closestHub !== hoveredHub) {
        setHoveredHub(closestHub);
      }
    }
  };

  const handleMouseLeave = () => {
    mouseTilt.current = { x: 0, y: 0 };
    setHoveredHub(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        ref={containerRef} 
        className="relative w-full max-w-[480px] aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Canvas for rendering 3D points */}
        <canvas
          ref={canvasRef}
          className="rounded-full shadow-inner z-0 pointer-events-none"
        />

        {/* Outer orbital rings for aesthetics */}
        <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/30 animate-[spin_80s_linear_infinite] pointer-events-none" />
        <div className="absolute inset-10 rounded-full border border-dashed border-slate-800/20 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

        {/* Floating Tooltip Card */}
        <AnimatePresence>
          {hoveredHub && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                left: `${hoverPos.x}px`,
                top: `${hoverPos.y - 12}px`,
                transform: 'translate(-50%, -100%)',
              }}
              className="bg-slate-950/90 border border-slate-800 text-slate-300 p-4 rounded-2xl shadow-2xl z-20 pointer-events-none w-[220px] backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="font-display font-bold text-white text-sm truncate">{hoveredHub.name}</h4>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active RVMs:</span>
                  <span className="font-semibold text-white">{hoveredHub.rvms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recycled (MT):</span>
                  <span className="font-semibold text-emerald-400">{hoveredHub.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payouts:</span>
                  <span className="font-semibold text-cyan-400">{hoveredHub.payouts}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/60 pt-1.5 mt-1.5 text-[10px]">
                  <span className="text-slate-500">CO2 Preventive:</span>
                  <span className="font-mono text-white/80">{hoveredHub.co2}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span>Drag globe to rotate • Hover nodes to inspect telemetry</span>
      </div>
    </div>
  );
}
