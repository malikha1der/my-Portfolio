import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableTilt?: boolean;
  onClick?: () => void;
  id?: string;
}

export function CardSpotlight({
  children,
  className = '',
  glowColor = 'rgba(56, 189, 248, 0.15)',
  enableTilt = true,
  onClick,
  id,
}: CardSpotlightProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    // Only enable tilt and dynamic cursor spotlight on devices with fine pointer (mouse), never touch screens
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHasFinePointer(media.matches);

    const handler = (e: MediaQueryListEvent) => setHasFinePointer(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasFinePointer || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -5;
      const tiltY = ((x - centerX) / centerX) * 5;
      setTilt({ x: tiltX, y: tiltY });
    }
  }, [hasFinePointer, enableTilt]);

  const handleMouseEnter = useCallback(() => {
    if (hasFinePointer) setIsHovered(true);
  }, [hasFinePointer]);

  const handleMouseLeave = useCallback(() => {
    if (hasFinePointer) {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
      setMousePos({ x: -1000, y: -1000 });
    }
  }, [hasFinePointer]);

  return (
    <div
      id={id}
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered && enableTilt && hasFinePointer
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(4px)`
          : undefined,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-6 md:backdrop-blur-sm transition-colors duration-300 hover:border-zinc-700/80 ${className}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow (Rendered only for desktop mouse) */}
      {hasFinePointer && (
        <>
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
            style={{
              background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
            style={{
              background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 80%)`,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
