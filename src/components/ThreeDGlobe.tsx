import React, { useEffect, useRef } from 'react';
import FloatingFeatureCards from './FloatingFeatureCards';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

export default function ThreeDGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Globe rotation states
  const rotationRef = useRef({ x: 0.3, y: 0.0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });
  
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

    // Handle resizing using ResizeObserver to support dynamic grid and display visibility transitions
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const rect = entry.contentRect;
        if (rect.width === 0) continue; // Ignore when container is hidden (e.g. mobile)

        const size = Math.min(rect.width, 540);
        canvas.width = size * window.devicePixelRatio;
        canvas.height = size * window.devicePixelRatio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        width = canvas.width;
        height = canvas.height;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

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
        projX: number;
        projY: number;
        projZ: number;
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
          projX,
          projY,
          projZ: z2,
        });
      });

      // Z-Sorting (Painters Algorithm: draw furthest (high Z) first)
      drawList.sort((a, b) => b.projZ - a.projZ);

      // Draw everything
      drawList.forEach((item) => {
        // Opacity based on depth
        const alpha = Math.max(0.08, 1 - (item.projZ + radius) / (2 * radius));

        ctx.beginPath();
        const size = Math.max(0.6, (1.8 * (radius * 1.5 - item.projZ)) / (radius * 2));
        ctx.arc(item.projX, item.projY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.7})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  // Global window listeners for drag & touch rotation
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      
      // Update rotation based on drag
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
    }
  };

  const handleMouseLeave = () => {
    mouseTilt.current = { x: 0, y: 0 };
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

        {/* Floating Feature Cards */}
        <FloatingFeatureCards />
      </div>
    </div>
  );
}
