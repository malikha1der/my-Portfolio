export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  category: '3D & WebGL' | 'Full Stack' | 'UI/UX & Creative' | 'Applications';
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  metrics?: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  category: 'Core Frontend' | '3D & Creative' | 'Architecture & Frameworks' | 'Tools & Ecosystem';
  icon: string;
  description: string;
  highlight?: boolean;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string[];
  skills: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  iconName: string;
  username: string;
}
