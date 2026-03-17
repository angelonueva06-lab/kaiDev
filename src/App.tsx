import React, { useState, useEffect, createContext, useContext, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Moon, 
  Sun, 
  Code, 
  Cpu, 
  Layout, 
  Terminal, 
  Server, 
  BookOpen, 
  PenTool, 
  Send,
  X,
  Menu,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowLeft,
  MessageSquare,
  Lock,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Download,
  LogIn
} from 'lucide-react';
import { Project, Service, Certificate, Message, User } from './types';

interface Settings {
  hero_name: string;
  hero_title: string;
  hero_bio: string;
  hero_image: string;
  about_title: string;
  about_bio: string;
  about_skills: string;
  about_stack: string;
  resume_url: string;
}

// --- Contexts ---
const ThemeContext = createContext<{ isDark: boolean; toggleTheme: () => void }>({ isDark: true, toggleTheme: () => {} });

import { useSupabase } from './SupabaseProvider';
import { supabase } from './lib/supabase';

// --- Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
      style={{ scaleX }}
    />
  );
};

const Reveal = ({ children, width = "100%", delay = 0 }: { children: React.ReactNode; width?: "fit-content" | "100%"; delay?: number }) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-white"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mb-8"
      />
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold tracking-tighter"
      >
        kaiDev<span className="text-primary">.DEV</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-zinc-500 font-mono"
      >
        Initializing creative environment...
      </motion.p>
    </motion.div>
  );
};

const Navbar = ({ onAdminClick }: { onAdminClick: () => void }) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user } = useSupabase();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Services', href: '#services' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'About', href: '#about' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass-dark' : 'py-6 bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tighter">
          kaiDev<span className="text-primary">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={onAdminClick} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Admin Login">
            <Lock size={20} />
          </button>
          {user && (
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass-dark border-t border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              <button onClick={toggleTheme} className="p-2 rounded-full bg-white/5">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={onAdminClick} className="p-2 rounded-full bg-white/5">
                <Lock size={20} />
              </button>
              {user && (
                <button onClick={handleLogout} className="p-2 rounded-full bg-red-500/10 text-red-500">
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = ({ settings, onHireClick }: { settings: Settings; onHireClick: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-primary font-mono font-bold tracking-widest mb-4 text-2xl md:text-3xl">{settings.hero_title}</h2>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">
            Hi, I'm <span className="text-gradient">{settings.hero_name}</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mb-8 leading-relaxed whitespace-pre-line">
            {settings.hero_bio}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={onHireClick}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-all flex items-center gap-2 group"
            >
              Hire me <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            {settings.resume_url ? (
              <a 
                href={settings.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 hover:border-primary/50 font-bold rounded-full transition-all flex items-center gap-2"
              >
                Resume <FileText size={20} />
              </a>
            ) : (
              <button 
                disabled
                className="px-8 py-4 border border-white/10 text-zinc-600 font-bold rounded-full transition-all flex items-center gap-2 cursor-not-allowed"
                title="Resume not available"
              >
                Resume <FileText size={20} />
              </button>
            )}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">FIND ME ON</p>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: "https://github.com/angelonueva06-lab" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/angelo-nueva-7225361a9/?originalSubdomain=ph" },
                { Icon: Mail, href: "mailto:angelonueva06@gmail.com" }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass hover:bg-primary hover:text-white transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden glass relative">
            <img 
              src={settings.hero_image || null} 
              alt={settings.hero_name} 
              className="w-full h-auto transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Floating elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -right-6 p-6 glass rounded-2xl"
          >
            <Code className="text-primary" size={32} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-6 -left-6 p-6 glass rounded-2xl"
          >
            <Cpu className="text-orange-500" size={32} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Projects = () => {
  const { projects, services } = useSupabase();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...services.map(s => s.name)];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  const displayedProjects = filteredProjects.slice(0, 3);

  return (
    <section id="projects" className="py-24 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <Reveal>
            <h2 className="text-primary font-mono font-bold tracking-widest mb-2">PORTFOLIO</h2>
            <h3 className="text-5xl font-bold tracking-tighter">Featured Projects</h3>
          </Reveal>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <p className="text-white dark:text-zinc-400 max-w-md md:text-right">
              A showcase of my work in Arduino systems and web development, focusing on automation and efficiency.
            </p>
            {projects.length > 3 && (
              <button 
                onClick={() => setShowAll(true)}
                className="px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold hover:bg-primary hover:text-white transition-all active:scale-95"
              >
                View All Projects
              </button>
            )}
          </motion.div>
        </div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {displayedProjects.length > 0 ? displayedProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)" 
                }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.image_url || `https://picsum.photos/seed/project-${project.id}/600/400`} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    {project.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{project.title}</h4>
                  <p className="text-white dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors">
                      View Details <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
                <Code size={48} className="mb-4 opacity-20" />
                <p>No projects found in this category.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showAll && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAll(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl max-h-[90vh] glass-dark rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold tracking-tighter">All Projects</h3>
                  <p className="text-zinc-500">A complete list of my professional work and experiments.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          filter === cat 
                            ? 'bg-primary text-white' 
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowAll(false)}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-8 overflow-y-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                  <div key={project.id} className="glass rounded-2xl overflow-hidden flex flex-col group">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={project.image_url || `https://picsum.photos/seed/project-${project.id}/600/400`} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h4>
                      <p className="text-white dark:text-zinc-400 text-xs leading-relaxed mb-4">
                        {project.description}
                      </p>
                      <button className="text-xs font-bold flex items-center gap-2 hover:text-primary transition-colors">
                        View Details <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
                    <p>No projects found in this category.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Services = ({ onServiceClick }: { onServiceClick: (service: string) => void }) => {
  const { services } = useSupabase();

  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <h2 className="text-primary font-mono font-bold tracking-widest mb-2">SERVICES</h2>
            <h3 className="text-5xl font-bold tracking-tighter">What I Can Do For You</h3>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.button
              key={service.id}
              onClick={() => onServiceClick(service.name)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass p-8 rounded-3xl text-left hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="text-primary mb-6 group-hover:scale-110 transition-transform">
                {service.icon ? (
                  <img src={service.icon} alt={service.name} className="w-10 h-10 object-contain" />
                ) : (
                  <Terminal size={40} />
                )}
              </div>
              <h4 className="text-xl font-bold mb-2">{service.name}</h4>
              <p className="text-zinc-500 text-sm leading-tight">{service.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

const Certificates = () => {
  const { certificates: certs } = useSupabase();
  const [showAll, setShowAll] = useState(false);

  const displayedCerts = certs.slice(0, 3);

  return (
    <section id="certificates" className="py-24 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <Reveal>
            <h2 className="text-primary font-mono font-bold tracking-widest mb-2">ACHIEVEMENTS</h2>
            <h3 className="text-5xl font-bold tracking-tighter">Certificates</h3>
          </Reveal>
          {certs.length > 3 && (
            <motion.button 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => setShowAll(true)}
              className="px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              View All Certificates
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {displayedCerts.length > 0 ? displayedCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/3] glass rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img 
                src={cert.image_url || null} 
                alt={cert.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] glass rounded-2xl flex items-center justify-center text-zinc-700">
                <FileText size={40} />
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAll && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAll(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] glass-dark rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold tracking-tighter">All Certificates</h3>
                  <p className="text-zinc-500">A collection of my academic and professional certifications.</p>
                </div>
                <button 
                  onClick={() => setShowAll(false)}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {certs.map((cert) => (
                  <div key={cert.id} className="aspect-[4/3] glass rounded-xl overflow-hidden group cursor-pointer">
                    <img 
                      src={cert.image_url || null} 
                      alt={cert.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const About = ({ settings }: { settings: Settings }) => {
  const skills = settings.about_skills.split(',').map(s => s.trim());
  const stacks = settings.about_stack.split(',').map(s => s.trim());

  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <h2 className="text-primary font-mono font-bold tracking-widest mb-2">ABOUT ME</h2>
          <h3 className="text-5xl font-bold tracking-tighter mb-8">{settings.about_title}</h3>
          <div className="space-y-6 text-zinc-400 leading-relaxed whitespace-pre-line">
            <p>{settings.about_bio}</p>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div>
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Terminal size={24} className="text-primary" /> Programming Tech Stack
            </h4>
            <div className="flex flex-wrap gap-3">
              {stacks.map(stack => (
                <span key={stack} className="px-4 py-2 glass rounded-full text-sm font-medium hover:border-primary/50 transition-colors">
                  {stack}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle size={24} className="text-primary" /> My Skillset
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {skills.map(skill => (
                <div key={skill} className="flex items-center gap-2 text-zinc-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ContactModal = ({ service, onClose }: { service: string; onClose: () => void }) => {
  const { user } = useSupabase();
  const [formData, setFormData] = useState({ 
    name: user?.displayName || '', 
    email: user?.email || '', 
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update form if user logs in while modal is open (unlikely but good for consistency)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Save to Supabase
      await supabase.from('messages').insert({
        ...formData,
        service,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      // 2. Send to Formspree for email notification (Optional)
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
      if (formspreeId && formspreeId !== 'mkoqqwqo' && formspreeId.trim() !== '') {
        try {
          await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              message: formData.message,
              service: service,
              _subject: `New Hire Request: ${service} from ${formData.name}`
            }),
          });
        } catch (formspreeErr) {
          console.warn('Formspree notification skipped or failed:', formspreeErr);
        }
      } else {
        console.log('Formspree ID not configured or using default. Skipping Formspree submission.');
      }

      setIsSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error('Contact form error:', err);
      alert(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-dark w-full max-w-lg rounded-3xl p-8 relative text-white"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
          <X size={24} />
        </button>

        <h3 className="text-3xl font-bold mb-2">Hire for <span className="text-primary">{service}</span></h3>
        <p className="text-zinc-500 mb-8">Fill out the form below and I'll get back to you shortly.</p>

        {isSuccess ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h4 className="text-2xl font-bold mb-2">Message Sent!</h4>
            <p className="text-zinc-500">Thank you for reaching out.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                readOnly={!!user?.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white ${user?.email ? 'opacity-70 cursor-not-allowed' : ''}`}
                placeholder="john@example.com"
              />
              {user?.email && (
                <p className="text-xs text-zinc-500 mt-1">Logged in as {user.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary transition-colors resize-none text-white"
                placeholder="Tell me about your project..."
              />
            </div>
            <button 
              disabled={isSubmitting}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={20} />
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { chatMessages: messages } = useSupabase();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('chat_session_id');
    if (!id) {
      id = Math.random().toString(36).substring(7);
      localStorage.setItem('chat_session_id', id);
    }
    return id;
  });

  const sessionMessages = messages.filter(m => m.session_id === sessionId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessionMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input;
    setInput('');

    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'User',
        text,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Chat send error:', err);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-dark w-80 h-96 rounded-3xl mb-4 overflow-hidden flex flex-col text-white"
          >
            <div className="p-4 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-bold">Chat with kaiDev</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
              {sessionMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === 'User' ? 'bg-primary text-white' : 'glass bg-white/5 text-zinc-300'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 ring-primary text-white"
              />
              <button className="p-2 bg-primary rounded-full text-white"><Send size={16} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary hover:bg-primary-dark text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <MessageSquare size={28} />
      </button>
    </div>
  );
};

const FileUpload = ({ 
  onUpload, 
  onRemove,
  label, 
  value,
  accept = "image/*"
}: { 
  onUpload: (url: string) => void, 
  onRemove?: () => void,
  label: string, 
  value?: string,
  accept?: string
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const path = `uploads/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('uploads').upload(path, file);
      if (error) throw error;
      
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
      onUpload(urlData.publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const isPdf = accept.includes('pdf');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-400">{label}</label>
      
      {value ? (
        <div className="relative group" key={value}>
          <div className="glass bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
            {isPdf ? (
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                <FileText size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                <img 
                  src={value.startsWith('http') ? value : `${value}${value.includes('?') ? '&' : '?'}t=${Date.now()}`} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    console.error('Image load error:', value);
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/200/200';
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{isPdf ? 'Uploaded Resume' : 'Uploaded Picture'}</p>
              <p className="text-xs text-zinc-500">Ready to save</p>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                title="Remove file"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-')}`}
            accept={accept}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
            className="flex items-center justify-center gap-2 px-6 py-4 glass bg-white/5 rounded-2xl cursor-pointer hover:border-primary/50 transition-all border-dashed border-2"
          >
            {isUploading ? 'Uploading...' : <><Plus size={20} /> {isPdf ? 'Upload Resume (PDF)' : 'Upload Image'}</>}
          </label>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'certificates' | 'messages' | 'history' | 'chat' | 'settings'>('messages');
  const [messageFilter, setMessageFilter] = useState<string>('All');
  const { 
    projects, 
    services, 
    certificates, 
    messages, 
    settings, 
    chatMessages,
    refreshData 
  } = useSupabase();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [localSettings, setLocalSettings] = useState<Settings | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const chatSessions = useMemo(() => {
    const sessions = new Map();
    chatMessages.forEach(msg => {
      if (!sessions.has(msg.session_id)) {
        sessions.set(msg.session_id, msg.created_at);
      }
    });
    return Array.from(sessions.entries()).map(([id, time]) => ({ session_id: id, last_message_at: time }));
  }, [chatMessages]);

  const selectedChatMessages = useMemo(() => {
    return chatMessages
      .filter(m => m.session_id === selectedSession)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [chatMessages, selectedSession]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedChatMessages]);

  const handleChatReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedSession) return;

    const text = chatInput;
    setChatInput('');

    try {
      await supabase.from('chat_messages').insert({
        session_id: selectedSession,
        sender: 'Admin',
        text,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Chat reply error:', err);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    try {
      await supabase.from(type).delete().eq('id', id);
      showNotification(`${type.slice(0, -1)} deleted successfully!`);
      await refreshData();
    } catch (err) {
      console.error('Delete failed:', err);
      showNotification('An error occurred while deleting', 'error');
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: string, contract_url?: string) => {
    try {
      await supabase.from('messages').update({
        status,
        ...(contract_url !== undefined && { contract_url })
      }).eq('id', id);
      showNotification(`Inquiry marked as ${status}!`);
      await refreshData();
    } catch (err) {
      console.error('Update failed:', err);
      showNotification('An error occurred while updating status', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const btn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'Saving...';

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      if (activeTab === 'settings') {
        await supabase.from('settings').upsert({ ...data, id: 'global' });
        showNotification('✅ Success! Your site content has been saved and updated.');
        return;
      }

      if (editingItem?.id) {
        await supabase.from(activeTab).update(data).eq('id', editingItem.id);
      } else {
        await supabase.from(activeTab).insert({
          ...data,
          created_at: new Date().toISOString()
        });
      }

      showNotification(`${activeTab.slice(0, -1)} saved successfully!`);
      await refreshData();
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Save failed:', err);
      showNotification('An error occurred while saving', 'error');
    } finally {
      btn.disabled = false;
      btn.innerText = originalText;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              notification.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            } glass`}
          >
            <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">Admin Dashboard</h1>
            <p className="text-zinc-500">Welcome back, <span className="text-primary">{user.username}</span></p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-red-500/20 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-12">
          <div className="space-y-2">
            {[
              { id: 'messages', name: 'Inquiries', icon: Mail },
              { id: 'history', name: 'Project History', icon: CheckCircle },
              { id: 'chat', name: 'Live Chat', icon: MessageSquare },
              { id: 'settings', name: 'Site Content', icon: Layout },
              { id: 'projects', name: 'Projects', icon: Layout },
              { id: 'services', name: 'Services', icon: Terminal },
              { id: 'certificates', name: 'Certificates', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all relative group ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' 
                    : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'text-primary' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-medium">{tab.name}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/5 rounded-2xl -z-10"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="glass rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold capitalize">
                {activeTab === 'settings' ? 'Site Content' : activeTab === 'chat' ? 'Live Chat History' : activeTab === 'history' ? 'Project History' : activeTab}
              </h2>
              {activeTab !== 'messages' && activeTab !== 'history' && activeTab !== 'chat' && activeTab !== 'settings' && !showForm && (
                <button 
                  onClick={() => { setEditingItem({}); setShowForm(true); }}
                  className="flex items-center gap-2 px-6 py-3 bg-primary rounded-full hover:bg-primary-dark transition-all"
                >
                  <Plus size={20} /> Add New
                </button>
              )}
            </div>

            {activeTab === 'settings' && localSettings && (
              <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-primary border-b border-white/10 pb-2">Hero Section</h3>
                    <div className="space-y-4">
                      <input type="text" name="hero_name" defaultValue={localSettings.hero_name} placeholder="Your Name" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                      <input type="text" name="hero_title" defaultValue={localSettings.hero_title} placeholder="Hero Title" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                      <textarea name="hero_bio" defaultValue={localSettings.hero_bio} placeholder="Hero Bio" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary h-32 text-white" />
                      <input type="hidden" name="hero_image" value={localSettings.hero_image || ''} />
                      <FileUpload 
                        label="Hero Picture" 
                        value={localSettings.hero_image}
                        onUpload={(url) => setLocalSettings(prev => prev ? {...prev, hero_image: url} : null)}
                        onRemove={() => {
                          setLocalSettings(prev => prev ? {...prev, hero_image: ''} : null);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-primary border-b border-white/10 pb-2">About Section</h3>
                    <div className="space-y-4">
                      <input type="text" name="about_title" defaultValue={localSettings?.about_title} placeholder="About Title" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                      <textarea name="about_bio" defaultValue={localSettings?.about_bio} placeholder="About Bio" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary h-32 text-white" />
                      <input type="text" name="about_skills" defaultValue={localSettings?.about_skills} placeholder="Skills (comma separated)" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                      <input type="text" name="about_stack" defaultValue={localSettings?.about_stack} placeholder="Tech Stack (comma separated)" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-primary border-b border-white/10 pb-2 mt-8">Resume Management</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-500">Upload a new PDF to update your resume across the site.</p>
                      <input type="hidden" name="resume_url" value={localSettings?.resume_url || ''} />
                      <FileUpload 
                        label="Resume (PDF)" 
                        accept="application/pdf" 
                        value={localSettings?.resume_url}
                        onUpload={(url) => setLocalSettings(prev => prev ? {...prev, resume_url: url} : null)}
                        onRemove={async () => {
                          const urlToDelete = localSettings?.resume_url;
                          setLocalSettings(prev => prev ? {...prev, resume_url: ''} : null);
                          if (urlToDelete) {
                            try {
                              const path = urlToDelete.split('/').pop();
                              await supabase.storage.from('uploads').remove([path]);
                            } catch (err) {
                              console.error('Delete failed:', err);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="px-12 py-4 bg-primary rounded-full font-bold hover:bg-primary-dark transition-all">Save All Site Content</button>
              </form>
            )}

            {showForm ? (
              <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                {activeTab === 'projects' && (
                  <>
                    <input type="text" name="title" defaultValue={editingItem?.title} placeholder="Project Title" required className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                    <select name="category" defaultValue={editingItem?.category} required className="w-full px-6 py-4 glass bg-zinc-900 rounded-2xl focus:outline-none focus:border-primary appearance-none cursor-pointer text-white">
                      <option value="" disabled>Select Category</option>
                      {services.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Description" required className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary h-32 text-white" />
                    <input type="hidden" name="image_url" value={editingItem?.image_url || ''} />
                    <FileUpload 
                      label="Project Image" 
                      value={editingItem?.image_url}
                      onUpload={(url) => setEditingItem(prev => prev ? {...prev, image_url: url} : null)}
                      onRemove={() => setEditingItem(prev => prev ? {...prev, image_url: ''} : null)}
                    />
                  </>
                )}
                {activeTab === 'services' && (
                  <>
                    <input type="text" name="name" defaultValue={editingItem?.name} placeholder="Service Name" required className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Description" className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary h-32 text-white" />
                    <input type="hidden" name="icon" value={editingItem?.icon || ''} />
                    <FileUpload 
                      label="Service Icon" 
                      value={editingItem?.icon}
                      onUpload={(url) => setEditingItem(prev => prev ? {...prev, icon: url} : null)}
                      onRemove={() => setEditingItem(prev => prev ? {...prev, icon: ''} : null)}
                    />
                  </>
                )}
                {activeTab === 'certificates' && (
                  <>
                    <input type="text" name="title" defaultValue={editingItem?.title} placeholder="Certificate Title" required className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white" />
                    <input type="hidden" name="image_url" value={editingItem?.image_url || ''} />
                    <FileUpload 
                      label="Certificate Image" 
                      value={editingItem?.image_url}
                      onUpload={(url) => setEditingItem(prev => prev ? {...prev, image_url: url} : null)}
                      onRemove={() => setEditingItem(prev => prev ? {...prev, image_url: ''} : null)}
                    />
                  </>
                )}
                <div className="flex gap-4">
                  <button type="submit" className="px-8 py-4 bg-primary rounded-full font-bold">Save Changes</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 py-4 glass rounded-full font-bold">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {(activeTab === 'messages' || activeTab === 'history') && (
                  <div className="flex justify-end mb-6">
                    <select
                      value={messageFilter}
                      onChange={(e) => setMessageFilter(e.target.value)}
                      className="px-4 py-2 glass bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary text-white cursor-pointer"
                    >
                      <option value="All" className="bg-zinc-900 text-white">All Services</option>
                      {services.map(s => (
                        <option key={s.id} value={s.name} className="bg-zinc-900 text-white">{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeTab === 'messages' && messages
                  .filter(msg => msg.status !== 'done')
                  .filter(msg => messageFilter === 'All' || msg.service === messageFilter)
                  .map(msg => (
                  <div key={msg.id} className={`p-6 glass bg-white/5 rounded-2xl border-l-4 flex flex-col gap-4 ${msg.status === 'declined' ? 'border-red-500 opacity-75' : msg.status === 'processing' ? 'border-yellow-500' : 'border-primary'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{msg.name}</h4>
                        <p className="text-sm text-zinc-500">{msg.email}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-bold bg-primary/20 text-primary rounded-md">{msg.service}</span>
                          {msg.status === 'processing' && (
                            <span className="inline-block px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-500 rounded-md">Processing</span>
                          )}
                          {msg.status === 'declined' && (
                            <span className="inline-block px-2 py-1 text-xs font-bold bg-red-500/20 text-red-500 rounded-md">Declined</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-mono text-zinc-600">{new Date(msg.created_at).toLocaleString()}</span>
                        {msg.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleUpdateMessageStatus(msg.id, 'processing')}
                              className="px-3 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-full transition-colors"
                            >
                              Process
                            </button>
                            <button 
                              onClick={() => handleUpdateMessageStatus(msg.id, 'declined')}
                              className="px-3 py-1 text-xs font-bold bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-full transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                        {msg.status === 'processing' && (
                          <button 
                            onClick={() => handleUpdateMessageStatus(msg.id, 'done', msg.contract_url)}
                            className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-full transition-colors mt-2"
                          >
                            Mark as Done
                          </button>
                        )}
                        {msg.status === 'declined' && (
                          <button 
                            onClick={() => handleUpdateMessageStatus(msg.id, 'pending')}
                            className="px-3 py-1 text-xs font-bold bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30 rounded-full transition-colors mt-2"
                          >
                            Re-open
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm italic">"{msg.message}"</p>
                    {msg.status === 'processing' && (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <p className="text-sm font-bold mb-2">Contract (Optional)</p>
                        <FileUpload 
                          label="Upload Contract Image"
                          value={msg.contract_url || ''}
                          onUpload={(url) => handleUpdateMessageStatus(msg.id, 'processing', url)}
                          onRemove={() => handleUpdateMessageStatus(msg.id, 'processing', '')}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {activeTab === 'history' && messages
                  .filter(msg => msg.status === 'done')
                  .filter(msg => messageFilter === 'All' || msg.service === messageFilter)
                  .map(msg => (
                  <div key={msg.id} className="p-6 glass bg-white/5 rounded-2xl border-l-4 border-green-500 opacity-75">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{msg.name}</h4>
                        <p className="text-sm text-zinc-500">{msg.email}</p>
                        <span className="inline-block px-2 py-1 mt-2 text-xs font-bold bg-primary/20 text-primary rounded-md">{msg.service}</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-600">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-zinc-400 text-sm italic">"{msg.message}"</p>
                    {msg.contract_url && (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <p className="text-sm font-bold mb-2">Attached Contract</p>
                        <a href={msg.contract_url} target="_blank" rel="noreferrer">
                          <img src={msg.contract_url} alt="Contract" className="max-h-48 rounded-lg border border-white/10 hover:opacity-80 transition-opacity" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}

                {activeTab === 'projects' && projects.map(proj => (
                  <div key={proj.id} className="flex items-center justify-between p-6 glass bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-6">
                      <img src={proj.image_url || 'https://picsum.photos/seed/placeholder/100/100'} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold">{proj.title}</h4>
                        <p className="text-sm text-zinc-500">{proj.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(proj); setShowForm(true); }} className="p-3 hover:text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95"><PenTool size={20} /></button>
                      <button onClick={() => handleDelete('projects', proj.id)} className="p-3 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-95"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}

                {activeTab === 'services' && services.map(serv => (
                  <div key={serv.id} className="flex items-center justify-between p-6 glass bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 glass rounded-lg flex items-center justify-center">
                        {serv.icon ? <img src={serv.icon} className="w-8 h-8 object-contain" /> : <Terminal size={24} />}
                      </div>
                      <h4 className="font-bold">{serv.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(serv); setShowForm(true); }} className="p-3 hover:text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95"><PenTool size={20} /></button>
                      <button onClick={() => handleDelete('services', serv.id)} className="p-3 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-95"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}

                {activeTab === 'certificates' && certificates.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between p-6 glass bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-6">
                      <img src={cert.image_url || null} className="w-20 h-12 rounded-lg object-cover" />
                      <h4 className="font-bold">{cert.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(cert); setShowForm(true); }} className="p-3 hover:text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95"><PenTool size={20} /></button>
                      <button onClick={() => handleDelete('certificates', cert.id)} className="p-3 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-95"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
                {activeTab === 'chat' && (
                  <div className="grid md:grid-cols-[280px_1fr] gap-8 h-[600px]">
                    <div className="glass bg-white/5 rounded-2xl overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-white/10 font-bold text-sm uppercase tracking-widest text-zinc-500">
                        Active Sessions
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {chatSessions.map(session => (
                          <button
                            key={session.session_id}
                            onClick={() => setSelectedSession(session.session_id)}
                            className={`w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 relative ${selectedSession === session.session_id ? 'bg-primary/20 border-r-4 border-r-primary' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-sm truncate">Session: {session.session_id}</div>
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-1">
                              Last active: {new Date(session.last_message_at).toLocaleTimeString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      {selectedSession ? (
                        <>
                          <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 glass bg-white/5 rounded-2xl">
                            {selectedChatMessages.map((m, i) => (
                              <div key={i} className={`flex ${m.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.sender === 'Admin' ? 'bg-primary text-white' : 'glass bg-white/5 text-zinc-300'}`}>
                                  <div className="flex justify-between items-center gap-4 mb-1">
                                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider">{m.sender}</span>
                                    <span className="text-[9px] opacity-40 font-mono">{new Date(m.createdAt).toLocaleTimeString()}</span>
                                  </div>
                                  {m.text}
                                </div>
                              </div>
                            ))}
                          </div>
                          <form onSubmit={handleChatReply} className="flex gap-2">
                            <input 
                              type="text" 
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              placeholder="Type a reply..."
                              className="flex-1 px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary text-white"
                            />
                            <button className="px-8 py-4 bg-primary rounded-2xl font-bold">Reply</button>
                          </form>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center glass bg-white/5 rounded-2xl text-zinc-500 italic">
                          Select a session to start chatting
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

const Login = ({ onBack, onLoginSuccess }: { onBack: () => void; onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'kaiDev' && password === '@Nueva123') {
      onLoginSuccess();
      return;
    }
    try {
      await supabase.auth.signInWithPassword({ email, password });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark w-full max-w-md p-10 rounded-3xl text-white"
      >
        <div className="text-center mb-10 relative">
          <button 
            onClick={onBack}
            className="absolute left-0 top-0 p-2 text-zinc-500 hover:text-white transition-colors"
            title="Back to home"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">Admin Login</h1>
          <p className="text-zinc-500">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Username</label>
            <input 
              type="text" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white"
              placeholder="Enter Username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-6 py-4 glass bg-white/5 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white pr-14"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all">
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const TechnologyLines = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dark mode: Cyan/Blue, Light mode: Indigo/Purple
      const particleColor = isDark ? 'rgba(14, 165, 233, 0.5)' : 'rgba(79, 70, 229, 0.3)';
      const lineColorBase = isDark ? '14, 165, 233' : '79, 70, 229';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColorBase}, ${0.2 - distance / 750})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
};

const BackgroundEffects = () => {
  const { isDark } = useContext(ThemeContext);
  const icons = [Code, Cpu, Layout, Terminal, Server];

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <TechnologyLines isDark={isDark} />
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div 
            key="dark-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            {/* Vertical scanning line */}
            <motion.div 
              animate={{ y: ['-100vh', '100vh'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50 blur-xl"
            />
          </motion.div>
        ) : (
          <motion.div 
            key="light-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Subtle Data Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            {/* Horizontal data streams */}
            <motion.div 
              animate={{ x: ['-100vw', '100vw'] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/3 inset-y-0 w-64 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50 blur-xl skew-x-12"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { user, settings } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isCustomAdmin, setIsCustomAdmin] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const isAdmin = user?.email === 'angelonueva06@gmail.com' || isCustomAdmin;

  useEffect(() => {
    document.body.className = isDark ? 'dark' : '';
  }, [isDark]);

  const handleHireClick = (service: string) => {
    if (!user) {
      setSelectedService(service);
      setShowAuthPrompt(true);
    } else {
      setSelectedService(service);
    }
  };

  if (isLoading) return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  if (!settings) return null;

  if (isAdmin && showLogin) return <AdminDashboard user={(user as any) || { email: 'kaiDev' }} onLogout={() => { supabase.auth.signOut(); setIsCustomAdmin(false); setShowLogin(false); }} />;

  if (showLogin) return <Login onBack={() => setShowLogin(false)} onLoginSuccess={() => { setIsCustomAdmin(true); setShowLogin(true); }} />;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      <div className="min-h-screen font-sans selection:bg-primary selection:text-white">
        <BackgroundEffects />
        <ScrollProgress />
        <Navbar onAdminClick={() => setShowLogin(true)} />
        
        <main>
          <Hero 
            settings={settings} 
            onHireClick={() => handleHireClick('General Inquiry')} 
          />
          <Projects />
          <Services onServiceClick={handleHireClick} />
          <Certificates />
          <About settings={settings} />
        </main>

        <motion.footer 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 glass-dark border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tighter mb-2">kaiDev<span className="text-primary">.</span></h3>
              <p className="text-zinc-500 text-sm">© 2026 kaiDev All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <a href="#projects" className="text-sm text-zinc-400 hover:text-primary transition-colors">Projects</a>
              <a href="#services" className="text-sm text-zinc-400 hover:text-primary transition-colors">Services</a>
              <a href="#about" className="text-sm text-zinc-400 hover:text-primary transition-colors">About</a>
            </div>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: "https://github.com/angelonueva06-lab" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/angelo-nueva-7225361a9/?originalSubdomain=ph" },
                { Icon: Mail, href: "mailto:angelonueva06@gmail.com" }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-primary transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </motion.footer>

        <ChatBox />

        <AnimatePresence>
          {showAuthPrompt && !user && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-dark w-full max-w-md rounded-3xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <LogIn size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Login Required</h3>
                <p className="text-zinc-400 mb-8">Please log in with your Google account to continue with your inquiry.</p>
                <div className="space-y-4">
                  <button 
                    onClick={async () => {
                      try {
                        await supabase.auth.signInWithOAuth({ provider: 'google' });
                        setShowAuthPrompt(false);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full py-4 bg-white text-zinc-950 font-bold rounded-2xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                  <button 
                    onClick={() => {
                      setShowAuthPrompt(false);
                      setSelectedService(null);
                    }}
                    className="w-full py-4 text-zinc-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {selectedService && user && (
            <ContactModal 
              service={selectedService} 
              onClose={() => setSelectedService(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}
