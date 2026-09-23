import { Code, Cpu, Eye, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CardSpotlight } from '../ui/CardSpotlight';
import { PERSONAL_INFO } from '../../data/portfolioData';

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'High-Performance Runtimes',
    description: 'Every millisecond counts. Committed to zero layout shifts, optimized draw calls, and 60-120 FPS frame stability across all hardware tiers.',
  },
  {
    icon: Cpu,
    title: 'Creative 3D & WebGL',
    description: 'Bridging technical code with artistic motion. Building bespoke Three.js scenes, custom GLSL shaders, and tactile spatial environments.',
  },
  {
    icon: Code,
    title: 'Modern Architecture',
    description: 'Clean, modular TypeScript, predictable state management, and modern component systems designed for long-term scalability.',
  },
  {
    icon: ShieldCheck,
    title: 'Inclusive & Accessible',
    description: 'Strict adherence to semantic HTML, full keyboard navigation, WCAG AA compliance, and native reduced-motion user preferences.',
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Section"
      className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 border-t border-zinc-900 overflow-hidden scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>01 // ABOUT ME</span>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Engineering digital experiences with mathematical precision and creative soul.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed">
            {PERSONAL_INFO.bio}
          </p>
        </div>

        {/* 2-Column Layout: Code Terminal & Principles Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          
          {/* Left Column: Interactive Terminal Preview */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-6 md:backdrop-blur-md shadow-2xl flex flex-col justify-between font-mono text-xs text-zinc-300">
              <div>
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-zinc-400 text-[11px]">malik_haider::manifest.ts</span>
                </div>

                {/* Code Content */}
                <div className="space-y-3 leading-relaxed">
                  <p className="text-zinc-400">// Core developer profile</p>
                  <p>
                    <span className="text-cyan-400">const</span> developer = &#123;
                  </p>
                  <p className="pl-4">
                    name: <span className="text-emerald-300">'Malik Haider'</span>,
                  </p>
                  <p className="pl-4">
                    role: <span className="text-emerald-300">'Frontend & 3D Technologist'</span>,
                  </p>
                  <p className="pl-4">
                    focus: [<span className="text-amber-300">'Three.js'</span>, <span className="text-amber-300">'React'</span>, <span className="text-amber-300">'TypeScript'</span>, <span className="text-amber-300">'GLSL'</span>],
                  </p>
                  <p className="pl-4">
                    performanceFirst: <span className="text-cyan-400">true</span>,
                  </p>
                  <p className="pl-4">
                    principles: [
                  </p>
                  <p className="pl-8 text-zinc-400">
                    'Smooth 60-120 FPS interaction',
                  </p>
                  <p className="pl-8 text-zinc-400">
                    'Minimalist & high-contrast UI',
                  </p>
                  <p className="pl-8 text-zinc-400">
                    'Accessible & keyboard friendly'
                  </p>
                  <p className="pl-4">
                    ],
                  </p>
                  <p className="pl-4">
                    status: <span className="text-emerald-300">'Open for select collaborations'</span>
                  </p>
                  <p>&#125;;</p>
                  <p className="mt-4 text-cyan-400">
                    developer.<span className="text-white">createExperience</span>();
                  </p>
                </div>
              </div>

              {/* Terminal Footer Status */}
              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Compiled cleanly</span>
                </span>
                <span>UTF-8</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Core Highlights */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <CardSpotlight
                  key={idx}
                  glowColor="rgba(56, 189, 248, 0.12)"
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-cyan-400 shadow-inner">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                    <span className="h-1 w-1 rounded-full bg-cyan-400" />
                    <span>PRODUCTION TESTED</span>
                  </div>
                </CardSpotlight>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
