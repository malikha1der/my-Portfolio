import { X, Cpu } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Close Project Details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Project Image Preview */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full border border-cyan-500/40 bg-zinc-950/80 px-3 py-1 font-mono text-xs text-cyan-300 backdrop-blur-md">
              {project.category}
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="mt-6">
          <h2 id="modal-project-title" className="font-display text-2xl sm:text-3xl font-bold text-white">
            {project.title}
          </h2>
          <p className="mt-1 font-mono text-sm text-cyan-400">
            {project.subtitle}
          </p>

          <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            {project.longDescription || project.description}
          </p>

          {/* Metrics / Performance Note */}
          {project.metrics && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs text-zinc-300">
              <Cpu className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Performance Metric: {project.metrics}</span>
            </div>
          )}

          {/* Technology Badges */}
          <div className="mt-6">
            <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
              Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-xs text-zinc-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Close Action */}
          <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-mono font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
