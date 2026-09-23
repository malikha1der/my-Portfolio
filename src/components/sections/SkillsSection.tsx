import { useState, useRef, useEffect, useCallback } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { SKILLS_DATA } from '../../data/portfolioData';
import { CardSpotlight } from '../ui/CardSpotlight';
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
  const [activeSkillName, setActiveSkillName] = useState<string>(SKILLS_DATA[0].name);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isManuallyToggled, setIsManuallyToggled] = useState<boolean>(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef<boolean>(false);
  const isManuallyToggledRef = useRef<boolean>(false);
  const isInteractingRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const scrollTickingRef = useRef<boolean>(false);

  // Sync refs with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isManuallyToggledRef.current = isManuallyToggled;
  }, [isManuallyToggled]);

  // Filter skills
  const filteredSkills = selectedCategory === 'All'
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === selectedCategory);

  // Repeat items 3 times for a completely seamless infinite wrap-around
  const loopedSkills = [...filteredSkills, ...filteredSkills, ...filteredSkills];

  // Set initial scroll offset to the middle third so user can scroll left or right immediately
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    // Defer slightly to ensure layout widths are calculated
    const timer = setTimeout(() => {
      if (slider) {
        const oneThird = slider.scrollWidth / 3;
        if (oneThird > 0 && slider.scrollLeft < 10) {
          slider.scrollLeft = oneThird;
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [filteredSkills]);

  // Update active card based on center position during manual scrolling
  const updateActiveCard = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const children = Array.from(slider.children) as HTMLElement[];
    if (!children.length) return;

    const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(childCenter - sliderCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    const skill = loopedSkills[closestIndex];
    if (skill && skill.name !== activeSkillName) {
      setActiveSkillName(skill.name);
    }
  }, [loopedSkills, activeSkillName]);

  // Handle native scroll event: seamless loop wrapping + active card calculation
  const handleScroll = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Infinite wrap-around bounds
    const oneThirdWidth = slider.scrollWidth / 3;
    if (oneThirdWidth > 0) {
      if (slider.scrollLeft >= oneThirdWidth * 2) {
        slider.scrollLeft -= oneThirdWidth;
      } else if (slider.scrollLeft <= 5) {
        slider.scrollLeft += oneThirdWidth;
      }
    }

    // Throttle active card calculation with requestAnimationFrame
    if (!scrollTickingRef.current) {
      window.requestAnimationFrame(() => {
        updateActiveCard();
        scrollTickingRef.current = false;
      });
      scrollTickingRef.current = true;
    }
  }, [updateActiveCard]);

  // Continuous smooth auto-scroll with IntersectionObserver gating (only runs when in viewport and not interacting)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let isSectionInView = false;
    let animationFrameId: number | null = null;
    const scrollSpeed = 0.85;

    const animateScroll = () => {
      if (!isSectionInView) {
        animationFrameId = null;
        return;
      }

      if (slider && !isPausedRef.current && !isInteractingRef.current && !isDraggingRef.current) {
        slider.scrollLeft += scrollSpeed;

        const oneThirdWidth = slider.scrollWidth / 3;
        if (slider.scrollLeft >= oneThirdWidth * 2) {
          slider.scrollLeft -= oneThirdWidth;
        } else if (slider.scrollLeft <= 5) {
          slider.scrollLeft += oneThirdWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animateScroll);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isSectionInView = entry.isIntersecting;
        if (isSectionInView) {
          if (animationFrameId === null) {
            animationFrameId = requestAnimationFrame(animateScroll);
          }
        } else {
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(slider);

    return () => {
      observer.disconnect();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [filteredSkills]);

  // --- TOUCH HANDLERS (Mobile: Butter-smooth native kinetic momentum) ---
  const handleTouchStart = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    isInteractingRef.current = true;
    hasMovedRef.current = false;
    setIsPaused(true);
  };

  const handleTouchMove = () => {
    hasMovedRef.current = true;
  };

  const handleTouchEnd = () => {
    isInteractingRef.current = false;
    // If not manually paused by button, gracefully resume auto-scroll after momentum settling
    if (!isManuallyToggledRef.current) {
      resumeTimeoutRef.current = window.setTimeout(() => {
        if (!isManuallyToggledRef.current && !isInteractingRef.current && !isDraggingRef.current) {
          setIsPaused(false);
        }
      }, 1200);
    }
  };

  // --- MOUSE DRAG HANDLERS (Desktop: Grab and slide with mouse) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    const slider = sliderRef.current;
    if (!slider) return;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    isDraggingRef.current = true;
    isInteractingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const slider = sliderRef.current;
    if (!slider) return;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startXRef.current);
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    slider.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      isInteractingRef.current = false;
      if (!isManuallyToggledRef.current) {
        resumeTimeoutRef.current = window.setTimeout(() => {
          if (!isManuallyToggledRef.current && !isInteractingRef.current) {
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
  };

  // Toggle button for user to deliberately Pause/Resume
  const toggleManualPause = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    setIsManuallyToggled((prev) => {
      const next = !prev;
      setIsPaused(next);
      return next;
    });
  };

  // Step Left/Right buttons (accessible 1-card steps)
  const scrollStep = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const children = Array.from(slider.children) as HTMLElement[];
    if (!children.length) return;

    const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
    let currentIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(childCenter - sliderCenter);
      if (diff < minDiff) {
        minDiff = diff;
        currentIndex = i;
      }
    }

    const targetIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(children.length - 1, currentIndex + 1);

    const targetCard = children[targetIndex];
    if (targetCard) {
      const targetScrollLeft = targetCard.offsetLeft - (slider.clientWidth - targetCard.offsetWidth) / 2;
      slider.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });

      const skill = loopedSkills[targetIndex];
      if (skill) {
        setActiveSkillName(skill.name);
      }
    }
  };

  return (
    <section
      id="skills"
      aria-label="Skills & Expertise Section"
      className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 border-t border-zinc-900 overflow-hidden scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-xs text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>02 // SKILLS & CAPABILITIES</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Tactile mastery across modern frontend & spatial web.
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Swipe with finger or use the controls to explore core frontend frameworks, WebGL 3D graphics, and architectural tools.
            </p>
          </div>

          {/* Controls: Auto-scroll Pause Toggle & Step Navigation */}
          <div className="flex items-center gap-2">
            {isPaused && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollStep('left')}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-zinc-700 hover:text-white active:scale-95 transition-all"
                  aria-label="Previous Skill"
                  title="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollStep('right')}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-zinc-700 hover:text-white active:scale-95 transition-all"
                  aria-label="Next Skill"
                  title="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={toggleManualPause}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-all ${
                isPaused
                  ? 'border-amber-500/50 bg-amber-950/30 text-amber-300'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
              }`}
              aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
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

        {/* Category Pills Filter */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
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

        {/* Interactive Smooth Auto-scrolling & Free-Swiping Skills Track */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="mt-8 flex gap-6 overflow-x-auto pb-6 pt-2 select-none cursor-grab active:cursor-grabbing focus:outline-none scrollbar-none overscroll-x-contain touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
          tabIndex={0}
          role="region"
          aria-label="Interactive Skills Track"
        >
          {loopedSkills.map((skill: SkillItem, index: number) => {
            const Icon = ICON_MAP[skill.icon] || Boxes;
            const isActive = activeSkillName === skill.name;

            return (
              <div
                key={`${skill.name}-${index}`}
                onClick={() => {
                  if (hasMovedRef.current) return;
                  setActiveSkillName(skill.name);
                  if (sliderRef.current) {
                    const cardEl = sliderRef.current.children[index] as HTMLElement;
                    if (cardEl) {
                      const targetScrollLeft = cardEl.offsetLeft - (sliderRef.current.clientWidth - cardEl.offsetWidth) / 2;
                      sliderRef.current.scrollTo({
                        left: Math.max(0, targetScrollLeft),
                        behavior: 'smooth',
                      });
                    }
                  }
                }}
                className="w-[280px] sm:w-[320px] shrink-0"
              >
                <CardSpotlight
                  glowColor={isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.12)'}
                  className={`h-full flex flex-col justify-between transition-all duration-300 ${
                    isActive
                      ? 'border-cyan-500/60 shadow-[0_0_25px_rgba(56,189,248,0.15)] bg-zinc-900/90'
                      : 'hover:border-zinc-700'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isActive
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                            : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      {skill.highlight && (
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 font-mono text-[10px] text-cyan-300">
                          CORE TECH
                        </span>
                      )}
                    </div>

                    {/* Skill Title & Category */}
                    <h3 className="mt-5 font-display text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                      {skill.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-cyan-400/80">
                      {skill.category}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  {/* Proficiency Meter */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
                      <span>Proficiency</span>
                      <span className="text-zinc-200 font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </CardSpotlight>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
