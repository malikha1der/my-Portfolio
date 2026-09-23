import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Boxes, 
  Atom, 
  FileCode2, 
  Palette, 
  Gauge, 
  Layers, 
  Zap, 
  Network, 
  LayoutTemplate, 
  GitBranch, 
  Code2,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { SKILLS_DATA } from '../../data/portfolioData';
import { SkillItem } from '../../types';

const ICON_MAP: Record<string, any> = {
  Boxes,
  Atom,
  FileCode2,
  Sparkles,
  Palette,
  Gauge,
  Layers,
  Zap,
  Network,
  LayoutTemplate,
  GitBranch,
  Code2,
};

const CATEGORIES = [
  'All',
  '3D & Creative',
  'Core Frontend',
  'Architecture & Frameworks',
  'Tools & Ecosystem',
] as const;

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rotation, setRotation] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [inspectedSkill, setInspectedSkill] = useState<SkillItem | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const isInspectedRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartRotationRef = useRef<number>(0);
  const lastDragXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const hasDraggedRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const hoverLeaveTimerRef = useRef<number | null>(null);

  // Sync refs with state for butter-smooth RAF loops (no stale closures)
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isHoveredRef.current = hoveredIndex !== null;
  }, [hoveredIndex]);

  useEffect(() => {
    isInspectedRef.current = inspectedSkill !== null;
  }, [inspectedSkill]);

  // Responsive screen size listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return selectedCategory === 'All'
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Balanced ring with 9 to 10 nodes for clean circular spacing
  const circleItems: SkillItem[] = useMemo(() => {
    if (filteredSkills.length >= 8 && filteredSkills.length <= 11) {
      return filteredSkills;
    }
    if (filteredSkills.length > 11) {
      return filteredSkills.slice(0, 10);
    }
    const result: SkillItem[] = [];
    while (result.length < 9) {
      for (const item of filteredSkills) {
        result.push(item);
        if (result.length >= 9) break;
      }
    }
    return result;
  }, [filteredSkills]);

  const totalCards = circleItems.length;
  const angleStep = 360 / totalCards;

  // Orbit dimensions:
  // radiusX: horizontal spread
  const radiusX = isMobile ? 160 : 280;
  // tiltY: back cards rise UP (-tiltY), front cards glide DOWN (+tiltY).
  // Left and right are at EXACT horizontal level y=0.
  const tiltY = isMobile ? 22 : 34;

  // Ultra-optimized 60fps auto-rotation loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isInView = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const isCardActive = isHoveredRef.current || isInspectedRef.current;

      if (
        isInView && 
        !isPausedRef.current && 
        !isCardActive && 
        !isDraggingRef.current && 
        !prefersReducedMotion
      ) {
        if (Math.abs(velocityRef.current) > 0.01) {
          rotationRef.current += velocityRef.current;
          velocityRef.current *= 0.92;
        } else {
          velocityRef.current = 0;
          // Framerate-independent rotation speed (approx 7.2 deg/sec)
          rotationRef.current -= delta * 7.2;
        }
        setRotation(rotationRef.current);
      }
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Step Left / Right navigation
  const handleStep = useCallback((direction: 'left' | 'right') => {
    const delta = direction === 'left' ? angleStep : -angleStep;
    velocityRef.current = 0;
    rotationRef.current += delta;
    setRotation(rotationRef.current);
    setHoveredIndex(null);
  }, [angleStep]);

  // Toggle Pause/Resume
  const togglePause = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    setIsManuallyPaused((prev) => {
      const next = !prev;
      setIsPaused(next);
      return next;
    });
  }, []);

  // Hover entry and exit with debounce
  const handleCardMouseEnter = useCallback((index: number, isFrontTrio: boolean) => {
    if (!isFrontTrio) return;
    if (hoverLeaveTimerRef.current) {
      clearTimeout(hoverLeaveTimerRef.current);
      hoverLeaveTimerRef.current = null;
    }
    setHoveredIndex(index);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (hoverLeaveTimerRef.current) clearTimeout(hoverLeaveTimerRef.current);
    hoverLeaveTimerRef.current = window.setTimeout(() => {
      setHoveredIndex(null);
    }, 80);
  }, []);

  // Open Full Detail Modal on Click
  const handleCardClick = useCallback((skill: SkillItem, isFrontTrio: boolean) => {
    if (!isFrontTrio || hasDraggedRef.current) return;
    setInspectedSkill(skill);
    setIsPaused(true);
  }, []);

  // Close Detail Modal & Resume Orbit
  const handleCloseInspection = useCallback(() => {
    setInspectedSkill(null);
    if (!isManuallyPaused) {
      resumeTimeoutRef.current = window.setTimeout(() => {
        setIsPaused(false);
      }, 300);
    }
  }, [isManuallyPaused]);

  // --- TOUCH HANDLERS (Mobile slide & rotate) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.touches[0].clientX;
    lastDragXRef.current = e.touches[0].clientX;
    dragStartRotationRef.current = rotationRef.current;
    velocityRef.current = 0;
    setIsPaused(true);

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartXRef.current;

    if (Math.abs(diff) > 4) {
      hasDraggedRef.current = true;
    }

    const deltaFromLast = currentX - lastDragXRef.current;
    velocityRef.current = deltaFromLast * 0.28;
    lastDragXRef.current = currentX;

    const sensitivity = isMobile ? 0.38 : 0.32;
    const newRot = dragStartRotationRef.current + diff * sensitivity;
    rotationRef.current = newRot;
    setRotation(newRot);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (!isManuallyPaused && !inspectedSkill) {
      resumeTimeoutRef.current = window.setTimeout(() => {
        if (!isManuallyPaused && !isDraggingRef.current && !isInspectedRef.current) {
          setIsPaused(false);
        }
      }, 1200);
    }
  };

  // --- MOUSE DRAG HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
    dragStartRotationRef.current = rotationRef.current;
    velocityRef.current = 0;
    setIsPaused(true);

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const diff = currentX - dragStartXRef.current;

    if (Math.abs(diff) > 4) {
      hasDraggedRef.current = true;
    }

    const deltaFromLast = currentX - lastDragXRef.current;
    velocityRef.current = deltaFromLast * 0.25;
    lastDragXRef.current = currentX;

    const sensitivity = 0.32;
    const newRot = dragStartRotationRef.current + diff * sensitivity;
    rotationRef.current = newRot;
    setRotation(newRot);
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (!isManuallyPaused && hoveredIndex === null && !inspectedSkill) {
        resumeTimeoutRef.current = window.setTimeout(() => {
          if (!isManuallyPaused && !isDraggingRef.current && !isInspectedRef.current) {
            setIsPaused(false);
          }
        }, 1000);
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
    handleCardMouseLeave();
  };

  // Keyboard navigation & Escape to close modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inspectedSkill) {
        handleCloseInspection();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inspectedSkill, handleCloseInspection]);

  return (
    <section
      id="skills"
      aria-label="Skills & Capabilities 3D Experience"
      className="relative pt-8 sm:pt-12 pb-14 sm:pb-18 border-t border-zinc-900 overflow-hidden scroll-mt-16 sm:scroll-mt-20"
      tabIndex={0}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-xs text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>02 // 3D SPATIAL SKILLS</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Tactile mastery across modern frontend & spatial web.
            </h2>
          </div>

          {/* Controls: Step Arrows & Pause Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleStep('left')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-cyan-500/50 hover:text-white active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Rotate Orbit Left"
                title="Rotate Left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleStep('right')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-cyan-500/50 hover:text-white active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Rotate Orbit Right"
                title="Rotate Right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={togglePause}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isPaused
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
              }`}
              aria-label={isPaused ? 'Resume 3D Rotation' : 'Pause 3D Rotation'}
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span>RESUME</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400" />
                  <span>PAUSE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setRotation(0);
                  rotationRef.current = 0;
                  setHoveredIndex(null);
                }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                    : 'border border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* 3D ORBIT STAGE */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="relative mt-8 h-[360px] sm:h-[400px] w-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center overflow-visible"
          role="region"
          aria-label="3D Skills Carousel"
        >
          {/* Subtle Ambient Floor Ring */}
          <div 
            className="pointer-events-none absolute bottom-4 w-[340px] sm:w-[520px] h-[90px] rounded-full bg-gradient-to-t from-cyan-500/10 via-zinc-900/20 to-transparent border border-cyan-500/15"
            style={{
              transform: 'rotateX(76deg) translateY(18px)',
              filter: 'blur(1px)',
            }}
          />

          {/* Orbit Nodes Container */}
          <div className="relative h-full w-full flex items-center justify-center overflow-visible">
            {circleItems.map((skill: SkillItem, index: number) => {
              const Icon = ICON_MAP[skill.icon] || Boxes;
              
              const baseAngle = (index * 360) / totalCards;
              const currentAngle = ((baseAngle + rotation) % 360 + 360) % 360;
              const rad = (currentAngle * Math.PI) / 180;
              
              // X: Left-to-right spread
              const x = Math.sin(rad) * radiusX;
              
              // Y: FRONT CARDS GLIDE SLIGHTLY DOWN (+tiltY), BACK CARDS RISE SLIGHTLY UP (-tiltY)
              // Level at edges (sin=±1 -> cos=0 -> y=0)
              const y = Math.cos(rad) * tiltY;
              
              // Depth factor
              const depth = (Math.cos(rad) + 1) / 2;

              // Distance from front (0 deg)
              const distFromFront = Math.min(currentAngle, 360 - currentAngle);

              // ONLY FRONT 3 CARDS ARE HOVERABLE / CLICKABLE!
              const isFrontTrio = distFromFront <= 52;
              const isHovered = hoveredIndex === index && isFrontTrio;

              // Opacity
              const cardOpacity = isHovered 
                ? 1 
                : isFrontTrio 
                  ? 1 
                  : Math.max(0.40, 0.40 + depth * 0.45);
              
              // Z-Index
              const zIndex = isHovered 
                ? 999 
                : isFrontTrio 
                  ? 500 + Math.round(depth * 100) 
                  : Math.round(depth * 100);

              return (
                <div
                  key={`${skill.name}-${index}`}
                  onClick={() => handleCardClick(skill, isFrontTrio)}
                  onMouseEnter={() => handleCardMouseEnter(index, isFrontTrio)}
                  onMouseLeave={handleCardMouseLeave}
                  style={{
                    position: 'absolute',
                    // Compact by default; generously enlarged on hover with ample room for full content!
                    width: isHovered 
                      ? (isMobile ? '170px' : '210px') 
                      : (isMobile ? '102px' : '122px'),
                    // Hardware accelerated 3D transform without rotateZ tilt -> straight & level!
                    transform: `translate3d(${x}px, ${y}px, 0px)`,
                    zIndex,
                    opacity: cardOpacity,
                    pointerEvents: isFrontTrio ? 'auto' : 'none',
                    transition: isDraggingRef.current 
                      ? 'none' 
                      : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.25s ease, opacity 0.25s',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'geometricPrecision',
                  }}
                  className={`p-0.5 focus:outline-none ${isFrontTrio ? 'cursor-pointer' : 'cursor-default'}`}
                  title={isFrontTrio ? 'Click to open full card details' : undefined}
                >
                  <div
                    className={`relative flex flex-col justify-between rounded-xl border transition-all duration-300 ${
                      isHovered
                        ? 'p-3.5 sm:p-4 border-cyan-400 bg-zinc-950 shadow-[0_0_30px_rgba(56,189,248,0.45)] ring-1 ring-cyan-400/80'
                        : isFrontTrio
                          ? 'p-2 sm:p-2.5 border-zinc-700/80 bg-zinc-950/95 hover:border-cyan-500/60 shadow-md'
                          : 'p-2 sm:p-2.5 border-zinc-800/60 bg-zinc-950/80'
                    }`}
                    style={{
                      // Generous height on hover so complete text is clearly visible without dots!
                      height: isHovered 
                        ? (isMobile ? '190px' : '220px') 
                        : (isMobile ? '96px' : '114px'),
                    }}
                  >
                    {/* Top Row: Icon + Percentage */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center justify-center rounded-lg border transition-all duration-300 ${
                            isHovered
                              ? 'h-8 w-8 sm:h-9 sm:w-9 border-cyan-400/80 bg-cyan-950/80 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                              : 'h-5 w-5 sm:h-6 sm:w-6 border-zinc-800 bg-zinc-900 text-cyan-400'
                          }`}
                        >
                          <Icon className={isHovered ? 'h-4.5 w-4.5 sm:h-5 sm:w-5' : 'h-3 w-3 sm:h-3.5 sm:w-3.5'} />
                        </div>

                        <span className="font-mono text-[10px] sm:text-[11px] font-bold text-cyan-300">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Skill Title */}
                      <h3 className={`font-display font-bold tracking-tight text-white transition-colors line-clamp-1 ${
                        isHovered 
                          ? 'mt-2 text-xs sm:text-[14px]' 
                          : 'mt-1 text-[11px] sm:text-xs'
                      }`}>
                        {skill.name}
                      </h3>
                      
                      {/* Category Label */}
                      <p className="mt-0.5 font-mono text-[8.5px] sm:text-[9.5px] text-cyan-400 font-semibold tracking-wide uppercase line-clamp-1">
                        {skill.category}
                      </p>

                      {/* Description: UNTRUNCATED on hover, 100% full content legible! */}
                      {isHovered && (
                        <p className="mt-2 text-[10.5px] sm:text-[11.5px] text-zinc-200 font-normal leading-relaxed">
                          {skill.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action / Mastery Bar */}
                    <div className="mt-1.5 pt-1.5 border-t border-zinc-800/80">
                      {isHovered ? (
                        <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400/90 font-medium">
                          <span>Click to Inspect</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </div>
                      ) : (
                        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* FULL DETAILED INSPECTION MODAL WITH "BACK" BUTTON */}
      {inspectedSkill && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseInspection}
          role="dialog"
          aria-modal="true"
          aria-label={`Detailed inspection for ${inspectedSkill.name}`}
        >
          <div 
            className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-zinc-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation Bar: Back Button + Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <button
                type="button"
                onClick={handleCloseInspection}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/50 px-4 py-1.5 font-mono text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Back to 3D Orbit"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>BACK TO ORBIT</span>
              </button>

              <button
                type="button"
                onClick={handleCloseInspection}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Full Unrestricted Skill Details */}
            <div className="mt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {(() => {
                    const ModalIcon = ICON_MAP[inspectedSkill.icon] || Boxes;
                    return (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/80 bg-cyan-950/60 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                        <ModalIcon className="h-7 w-7" />
                      </div>
                    );
                  })()}
                  <div>
                    <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      {inspectedSkill.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                      {inspectedSkill.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
                    {inspectedSkill.level}%
                  </span>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Mastery</p>
                </div>
              </div>

              {/* Animated Mastery Progress Bar */}
              <div className="mt-5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-700"
                    style={{ width: `${inspectedSkill.level}%` }}
                  />
                </div>
              </div>

              {/* Full Detailed Description (Zero Truncation) */}
              <div className="mt-6 rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 sm:p-5">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Technical Overview & Architecture
                </h4>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
                  {inspectedSkill.description}
                </p>
              </div>

              {/* Core Capabilities Checklist */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Production Ready</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>High Performance</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Responsive Design</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Clean Architecture</span>
                </div>
              </div>

              {/* Bottom Quick Return Button */}
              <button
                type="button"
                onClick={handleCloseInspection}
                className="mt-6 w-full rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 to-zinc-900 py-3 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 hover:border-cyan-400 hover:text-white transition-all shadow-md"
              >
                ← Return to Rotating 3D Cards
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
