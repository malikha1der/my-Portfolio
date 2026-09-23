import { ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand Monogram & Copyright */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 font-mono text-xs font-bold text-cyan-400">
              MH
            </div>
            <p className="text-xs font-mono text-zinc-400">
              © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
            </p>
          </div>

          {/* Right: Scroll to Top (Selective will-change: transform) */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-mono text-zinc-300 transition-all hover:border-zinc-700 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 will-change-transform"
            aria-label="Back to Top"
          >
            <span>TOP</span>
            <ArrowUp className="h-3.5 w-3.5 text-cyan-400" />
          </button>

        </div>
      </div>
    </footer>
  );
}
