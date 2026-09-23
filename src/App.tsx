import { useState, useEffect } from 'react';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Zero-overhead scroll spy using IntersectionObserver (eliminates layout-thrashing scroll reads)
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // 20% from top, 60% from bottom gives precise active section detection during scroll
        rootMargin: '-15% 0px -55% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08080a] text-zinc-100 selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Interactive Cursor Follower (Desktop only, automatically null on mobile/touch) */}
      <CustomCursor />

      {/* Sticky Compact Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Portfolio Sections */}
      <main id="main-content" className="relative">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
