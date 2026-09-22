import { useState } from 'react';
import { Layers, ArrowUpRight, Info } from 'lucide-react';
import { PROJECTS_DATA } from '../../data/portfolioData';
import { CardSpotlight } from '../ui/CardSpotlight';
import { ProjectModal } from '../ui/ProjectModal';
import { Project } from '../../types';

const CATEGORIES = ['All', 'Applications', '3D & WebGL'];

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="projects"
      aria-label="Featured Projects Section"
      className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 border-t border-zinc-900 overflow-hidden scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-xs text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>03 // FEATURED WORK</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Selected projects built for speed, depth, and immersion.
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Production web applications, logistics platforms, and interactive digital interfaces built with modern web technologies.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'border border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <CardSpotlight
              key={project.id}
              glowColor="rgba(56, 189, 248, 0.15)"
              className="flex flex-col justify-between h-full group"
            >
              <div>
                {/* Project Image Box */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 mb-5">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                  
                  {/* Category Pill Over Image */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 font-mono text-[10px] text-zinc-300 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full border border-cyan-500/40 bg-cyan-950/80 px-2.5 py-1 font-mono text-[10px] text-cyan-300 backdrop-blur-md">
                        FEATURED
                      </span>
                    </div>
                  )}

                  {/* Architecture Info Button */}
                  <button
                    type="button"
                    onClick={() => setActiveModalProject(project)}
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900/90 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-800 hover:text-white"
                    aria-label={`View architecture details for ${project.title}`}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>

                {/* Subtitle & Title */}
                <span className="font-mono text-xs text-cyan-400 font-medium">
                  {project.subtitle}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-zinc-800/80 bg-zinc-900/80 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="rounded-md border border-zinc-800/80 bg-zinc-900/80 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>View Project Specifications</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardSpotlight>
          ))}
        </div>

      </div>

      {/* Extended Project Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
}
