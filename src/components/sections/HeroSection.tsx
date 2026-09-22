import { Suspense } from 'react';
import { ArrowDown, Sparkles, Send, Github, Terminal, Layers } from 'lucide-react';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';
import { PERSONAL_INFO } from '../../data/portfolioData';

export function HeroSection() {
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-12 sm:pt-28 sm:pb-20 overflow-hidden"
    >
      {/* Background Decorative Grid Lines */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 right-10 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[130px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Typography & CTAs */}
          <div className="flex flex-col items-start lg:col-span-6 z-10">
            {/* Status Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs text-zinc-300">
                {PERSONAL_INFO.status}
              </span>
            </div>

            {/* Main Greeting & Identity */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-cyan-300">{PERSONAL_INFO.name}</span>
            </h1>

            {/* Role Title with Cybernetic Accent */}
            <div className="mt-4 flex items-center gap-2.5">
              <div className="h-0.5 w-6 bg-cyan-400" />
              <p className="font-mono text-sm sm:text-base font-medium text-cyan-400 tracking-wide uppercase">
                {PERSONAL_INFO.title}
              </p>
            </div>

            {/* Tagline / Professional Introduction */}
            <p className="mt-6 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
              {PERSONAL_INFO.tagline}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToProjects}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-zinc-100 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Layers className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Explore Works</span>
              </button>

              <button
                type="button"
                onClick={scrollToContact}
                className="group inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Send className="h-4 w-4 text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                <span>Get In Touch</span>
              </button>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="GitHub Profile"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>

            {/* Experience / Impact Highlights */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-800/80 w-full">
              {PERSONAL_INFO.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs text-zinc-400 font-mono">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Interactive Mannequin Canvas */}
          <div className="relative flex items-center justify-center lg:col-span-6 h-[460px] sm:h-[540px] lg:h-[620px] w-full">
            {/* Ambient Circular Frame Glow */}
            <div className="pointer-events-none absolute inset-6 sm:inset-12 rounded-full bg-gradient-to-tr from-cyan-950/20 via-zinc-900/40 to-transparent border border-zinc-800/40 shadow-2xl" />

            {/* 3D WebGL Canvas */}
            <Suspense fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                  <Terminal className="h-4 w-4 animate-spin text-cyan-400" />
                  <span>INITIALIZING 3D ENGINE...</span>
                </div>
              </div>
            }>
              <Hero3DCanvas />
            </Suspense>
          </div>

        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#about"
            className="group flex flex-col items-center gap-2 text-xs font-mono text-zinc-400 transition-colors hover:text-cyan-400"
            aria-label="Scroll to About Section"
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown className="h-4 w-4 animate-bounce text-cyan-400/80 group-hover:text-cyan-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
