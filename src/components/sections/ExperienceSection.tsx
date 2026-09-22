import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { EXPERIENCE_DATA } from '../../data/portfolioData';
import { CardSpotlight } from '../ui/CardSpotlight';

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-label="Experience & Career Journey Section"
      className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 border-t border-zinc-900 overflow-hidden scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>04 // CAREER TIMELINE</span>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Engineering journey across production codebases.
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Proven track record of delivering resilient, high-speed frontend applications, interactive graphics, and modular UI systems.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="mt-16 space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-6 before:h-full before:w-0.5 before:bg-zinc-800">
          {EXPERIENCE_DATA.map((exp, idx) => (
            <div key={idx} className="relative flex items-start gap-6 sm:gap-10">
              
              {/* Timeline Node Icon */}
              <div className="relative z-10 flex h-7 w-7 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-cyan-400 shadow-md">
                <Briefcase className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </div>

              {/* Experience Card */}
              <div className="flex-1">
                <CardSpotlight
                  glowColor="rgba(56, 189, 248, 0.12)"
                  className="p-6 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800/80 pb-4">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                        {exp.role}
                      </h3>
                      <p className="mt-1 font-mono text-sm text-cyan-400">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        {exp.period}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills Applied */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-400 mr-2">
                      STACK:
                    </span>
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-zinc-800 bg-zinc-900/90 px-2.5 py-0.5 font-mono text-xs text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardSpotlight>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
