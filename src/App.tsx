import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DubaiRecruiterFacts } from './components/DubaiRecruiterFacts';
import { MetricsGrid } from './components/MetricsGrid';
import { AiArchitectureShowcase } from './components/AiArchitectureShowcase';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillMatrix } from './components/SkillMatrix';
import { ContactFooter } from './components/ContactFooter';
import { ResumeModal } from './components/ResumeModal';
import { DocMindShowcase } from './components/DocMindShowcase';
import { DocMindOverlay } from './components/DocMindOverlay';

function MainLayout() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const isManualNavRef = useRef(false);
  const manualNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectionIds = ['hero', 'dubai-facts', 'ai-project', 'metrics', 'ai-spotlight', 'experience', 'skills', 'contact'];

  // Mouse Movement Ambient Glow Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll Spy Observer
  useEffect(() => {
    const handleScroll = () => {
      if (isManualNavRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (scrollY < 150) {
        setActiveSection('hero');
        return;
      }

      const targetPoint = scrollY + viewportHeight / 3;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop - 120;
          if (targetPoint >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    
    isManualNavRef.current = true;
    if (manualNavTimerRef.current) clearTimeout(manualNavTimerRef.current);
    manualNavTimerRef.current = setTimeout(() => {
      isManualNavRef.current = false;
    }, 900);

    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] font-sans transition-colors duration-250 relative pb-20 sm:pb-24">
      
      {/* Interactive Mouse Movement Ambient Lighting Layer */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, var(--mouse-glow), transparent 75%)`
        }}
      />

      {/* Header Navigation with Active Highlight & Theme Toggle */}
      <Navbar
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Hero Section */}
      <HeroSection onOpenResumeModal={() => setIsResumeModalOpen(true)} />

      {/* Recruiter Quick Facts Bar */}
      <DubaiRecruiterFacts />

      {/* DocMind Featured AI Project */}
      <DocMindShowcase />

      {/* Proven Metrics Grid */}
      <MetricsGrid />

      {/* AI-Native Specialisation */}
      <AiArchitectureShowcase />

      {/* Career History Timeline */}
      <ExperienceTimeline />

      {/* Skills Matrix */}
      <SkillMatrix />

      {/* Contact & Footer */}
      <ContactFooter />

      {/* Full-Screen DocMind AI Assistant Overlay */}
      <DocMindOverlay isOpen={isChatOpen} onOpenChange={setIsChatOpen} />

      {/* Full Resume View Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;
