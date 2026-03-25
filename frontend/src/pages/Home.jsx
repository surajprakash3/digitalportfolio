import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Download, MapPin, Briefcase, GraduationCap, ChevronDown, Terminal, Cpu, Database, Code, Github, Linkedin, Twitter } from 'lucide-react';
import { getProfile } from '../services/api';
import SEO from '../components/SEO';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Certifications from './Certifications';
import Blog from './Blog';
import Social from './Social';
import Contact from './Contact';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 200 } }
};

const AnimatedText = ({ text, className }) => (
  <motion.span
    className={className}
    initial="hidden"
    animate="visible"
    variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
  >
    {text.split('').map((char, index) => (
      <motion.span key={index} variants={textVariants} className="inline-block">
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </motion.span>
);

const Typewriter = ({ words }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer = setTimeout(() => {
      const i = loopNum % words.length;
      const fullText = String(words[i]);

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(30);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <span className="inline-flex items-center text-theme-text font-bold">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[3px] h-[1.1em] bg-accent-500 ml-[2px] rounded-full shadow-[0_0_8px_rgba(var(--color-accent-500),0.8)]"
      />
    </span>
  );
};

const FloatingElement = ({ children, delay = 0, duration = 4, xRange = [-15, 15], yRange = [-20, 20], ...props }) => (
  <motion.div
    {...props}
    animate={{ x: xRange, y: yRange, rotate: [0, 5, -5, 0] }}
    transition={{ duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Spotlight & Parallax State
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tracking parallax objects slowly
  const springConfig = { damping: 40, stiffness: 100, mass: 0.5 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // Direct spring for the spotlight mouse overlay
  const spotX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.2 });
  const spotY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.2 });
  const spotlightTemplate = useMotionTemplate`radial-gradient(500px circle at ${spotX}px ${spotY}px, rgba(var(--color-accent-500), 0.08), transparent 80%)`;

  // --- RULE OF HOOKS FIX: Hoist all useTransform hooks before conditional returns ---
  const floating1X = useTransform(parallaxX, v => v * 0.05 - 50);
  const floating1Y = useTransform(parallaxY, v => v * 0.05 - 50);
  
  const floating2X = useTransform(parallaxX, v => v * -0.04 + 20);
  const floating2Y = useTransform(parallaxY, v => v * -0.04 - 10);
  
  const floating3X = useTransform(parallaxX, v => v * 0.03 + 50);
  const floating3Y = useTransform(parallaxY, v => v * 0.03 + 50);
  
  const floating4X = useTransform(parallaxX, v => v * -0.06 - 30);
  const floating4Y = useTransform(parallaxY, v => v * -0.06 + 80);

  const heroBgX = useTransform(parallaxX, v => v * -0.05);
  const heroBgY = useTransform(parallaxY, v => v * -0.05);

  const heroCardX = useTransform(parallaxX, v => v * 0.03);
  const heroCardY = useTransform(parallaxY, v => v * 0.03);

  const heroChipX = useTransform(parallaxX, v => v * 0.08);
  const heroChipY = useTransform(parallaxY, v => v * 0.08);
  // --- END OF HOOKS ---

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const BASE_URL = API_URL.replace('/api', '');
    return `${BASE_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center min-h-[calc(100vh-64px)] justify-center px-4">
        <div className="max-w-4xl mx-auto text-center animate-pulse space-y-6">
          <div className="h-8 w-48 bg-theme-border rounded-full mx-auto"></div>
          <div className="h-16 w-96 bg-theme-border rounded-lg mx-auto"></div>
          <div className="h-6 w-80 bg-theme-border rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  const name = profile?.hero?.fullName || 'Suraj Prakash';
  const titleWords = (profile?.hero?.roles && profile.hero.roles.length > 0) 
        ? profile.hero.roles 
        : ['Cloud Enthusiast', 'Full Stack Developer', 'Problem Solver'];
  
  const tagline = profile?.hero?.tagline || 'Building scalable, modern, and high-performance applications.';
  const shortDescription = profile?.hero?.shortDescription || 'I build beautiful, responsive, and performant web applications using modern technologies.';
  const available = profile?.hero?.availability !== false;
  const stats = profile?.hero?.stats || { projects: '10+', experience: '3+ Years', contributions: '50+' };
  const socials = profile?.socials || {};
  const resumeUrl = profile?.hero?.resumeUrl;
  const profileImage = profile?.hero?.profileImage;

  return (
    <>
      <SEO title="Home" description={tagline} url="/" />

      <section
        id="home"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden min-h-screen flex items-center group/hero"
      >
        {/* Absolute Background Layers */}
        {/* Spotlight following cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700 mix-blend-screen"
          style={{ background: spotlightTemplate }}
        />
        
        {/* Low Opacity Noise Grid Texture */}
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Floating tech elements attached to parallax via transforms manually */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <motion.div style={{ x: floating1X, y: floating1Y }} className="absolute top-[20%] right-[15%] opacity-20 hidden md:block">
            <FloatingElement delay={0} duration={6}><Terminal size={60} className="text-accent-500/50" /></FloatingElement>
          </motion.div>
          <motion.div style={{ x: floating2X, y: floating2Y }} className="absolute bottom-[20%] right-[30%] opacity-20 hidden lg:block">
            <FloatingElement delay={1} duration={8}><Cpu size={70} className="text-accent-500/40" /></FloatingElement>
          </motion.div>
          <motion.div style={{ x: floating3X, y: floating3Y }} className="absolute top-[30%] left-[5%] opacity-10 hidden sm:block">
            <FloatingElement delay={2} duration={5}><Database size={50} className="text-accent-500/60" /></FloatingElement>
          </motion.div>
          <motion.div style={{ x: floating4X, y: floating4Y }} className="absolute bottom-[10%] left-[15%] opacity-15 hidden md:block">
            <FloatingElement delay={1.5} duration={7}><Code size={40} className="text-accent-500/50" /></FloatingElement>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full z-10 relative">

          {/* Left Column: Text & Accents */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badges / Availability */}
            {available && (
              <motion.div variants={itemVariants} className="mb-6 inline-flex items-center space-x-2 bg-accent-500/10 text-accent-500 px-4 py-2 rounded-full border border-accent-500/30 shadow-[0_0_15px_rgba(var(--color-accent-500),0.15)] mx-auto lg:mx-0 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wide uppercase">Open to new opportunities</span>
              </motion.div>
            )}

            {/* Hero Headers */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-4 tracking-tight leading-tight relative z-20">
               {/* Soft Glowing Radial Light behind Name */}
              <div className="absolute inset-0 bg-accent-500/15 blur-[60px] rounded-full scale-150 animate-pulse -z-10 w-1/2 h-1/2 left-[25%] top-[25%] mix-blend-plus-lighter pointer-events-none"></div>
              
              <motion.span variants={itemVariants} className="inline-block mr-4 text-theme-text drop-shadow-md">Hi, I'm</motion.span>
              <AnimatedText text={name} className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-accent-300 to-blue-500 relative inline-block pb-2 animate-gradient drop-shadow-lg" />
            </h1>

            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold opacity-90 mb-6 font-heading flex flex-wrap items-center justify-center lg:justify-start gap-2 h-10 md:h-12 overflow-hidden">
               <span className="text-theme-muted">I am a </span> <Typewriter words={titleWords} />
            </motion.h2>

            {/* Impact Statements */}
            <motion.div variants={itemVariants} className="space-y-4 mb-8 text-lg text-theme-muted max-w-2xl mx-auto lg:mx-0">
              <p className="font-semibold text-theme-text text-xl leading-relaxed">
                {tagline}
              </p>
              <p className="text-sm font-medium leading-relaxed drop-shadow-sm">{shortDescription}</p>
            </motion.div>

            {/* Premium Animated Stats Section */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-10 border-y border-theme-border/50 py-4 w-full md:w-max">
              <motion.div variants={statVariants} className="flex flex-col items-center lg:items-start group">
                 <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-300 transform group-hover:scale-110 transition-transform">{stats.projects}</span>
                 <span className="text-xs font-bold text-theme-muted uppercase tracking-wider mt-1">Projects</span>
              </motion.div>
              <div className="w-px h-10 bg-theme-border/50 hidden sm:block"></div>
              <motion.div variants={statVariants} className="flex flex-col items-center lg:items-start group">
                 <span className="text-2xl font-black text-theme-text transform group-hover:scale-110 transition-transform">{stats.experience}</span>
                 <span className="text-xs font-bold text-theme-muted uppercase tracking-wider mt-1">Experience</span>
              </motion.div>
              <div className="w-px h-10 bg-theme-border/50 hidden sm:block"></div>
              <motion.div variants={statVariants} className="flex flex-col items-center lg:items-start group">
                 <span className="text-2xl font-black text-theme-text transform group-hover:scale-110 transition-transform">{stats.contributions}</span>
                 <span className="text-xs font-bold text-theme-muted uppercase tracking-wider mt-1">Contributions</span>
              </motion.div>
            </motion.div>

            {/* Call to Actions Enhancement */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <motion.a 
                href="#projects" 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white overflow-hidden rounded-2xl border border-transparent hover:shadow-[0_0_20px_rgba(var(--color-accent-500),0.4)] w-full sm:w-auto"
              >
                {/* Animated flowing gradient layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 via-accent-400 to-accent-600 bg-[length:200%_auto] animate-gradient z-0"></div>
                {/* Ripple overlay on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-0"></div>
                <span className="relative z-10 flex items-center">
                  View My Work
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </motion.a>
              
              <motion.a 
                href={(resumeUrl) ? resumeUrl : "/api/resume/download"}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-theme-text transition-all duration-300 bg-theme-card/60 backdrop-blur-md hover:bg-theme-bg/80 hover:text-accent-500 rounded-2xl border border-theme-border w-full sm:w-auto shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(var(--color-accent-500),0.2)] tracking-wide" 
                download
              >
                <Download className="w-5 h-5 mr-2" />
                Download CV
              </motion.a>
            </motion.div>

            {/* Social Links under CTA */}
            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                {socials?.githubUrl && (
                    <motion.a whileHover={{ y: -3, scale: 1.1 }} title='GitHub' href={socials.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-colors">
                        <Github size={18} />
                    </motion.a>
                )}
                {socials?.linkedinUrl && (
                    <motion.a whileHover={{ y: -3, scale: 1.1 }} title='LinkedIn' href={socials.linkedinUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-colors">
                        <Linkedin size={18} />
                    </motion.a>
                )}
                {socials?.twitterUrl && (
                    <motion.a whileHover={{ y: -3, scale: 1.1 }} title='Twitter' href={socials.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-colors">
                        <Twitter size={18} />
                    </motion.a>
                )}
            </motion.div>
          </motion.div>

          {/* Right Column: Image & Glassmorphism Upgraded Parallax */}
          <motion.div
            className="lg:col-span-5 relative mt-16 lg:mt-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Massive Parallax Backdrop Blob */}
            <motion.div 
               style={{ x: heroBgX, y: heroBgY }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-accent-500/20 to-accent-300/10 blur-[80px] rounded-[50%] -z-10 transition-colors duration-700" 
            />

            <motion.div 
              style={{ x: heroCardX, y: heroCardY }}
              className="relative w-full aspect-[4/5] max-w-xs sm:max-w-sm mx-auto lg:ml-auto group cursor-pointer perspective-1000"
            >
              {/* Spinning / Glowing Layered Border Behind Profile */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-600 via-blue-500 to-accent-400 rounded-[2.5rem] opacity-30 blur-md group-hover:opacity-70 group-hover:duration-300 transition-opacity animate-gradient"></div>
              
              {/* Main Profile Glass Card with Floating hover animation */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-theme-card/40 backdrop-blur-2xl rounded-[2.2rem] p-2.5 shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_40px_rgba(var(--color-accent-500),0.3)] border border-theme-border/50 relative transition-all duration-500 group-hover:block-layer"
              >
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative bg-theme-bg shadow-inner transition-colors duration-500">
                  {profileImage ? (
                    <img
                      src={getImageUrl(profileImage)}
                      alt={name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-95 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-theme-muted bg-theme-bg/50">
                      <span className="font-medium text-lg mb-2">No Image Found</span>
                    </div>
                  )}
                  {/* Subtle vignette inner shadow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.3)] pointer-events-none rounded-[1.8rem]"></div>
                </div>
              </motion.div>

              {/* Parallax Floating Years of Experience Chip */}
              {(stats.experience) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{ x: heroChipX, y: heroChipY }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                  className="absolute -bottom-8 -left-4 lg:-left-12 bg-theme-card/90 backdrop-blur-2xl px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(var(--color-accent-500),0.2)] flex items-center gap-4 border border-theme-border/40 z-20 transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-default"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg ring-4 ring-theme-bg">
                    {String(stats.experience).split('+')[0].split(' ')[0]}+
                  </div>
                  <div>
                    <p className="text-[10px] text-theme-muted font-black tracking-widest uppercase leading-tight mb-0.5">Years</p>
                    <p className="font-extrabold text-theme-text text-lg leading-tight tracking-tight">Experience</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

        </div>

        {/* Scroll Indicator & Glowing Target Divider */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-20">
           <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-theme-muted mb-2 opacity-50">Scroll</span>
           <motion.div
             animate={{ y: [0, 8, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="w-6 h-10 border-2 border-theme-muted/40 rounded-full flex justify-center p-1 backdrop-blur-sm"
           >
             <motion.div 
                animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-accent-500 rounded-full" 
             />
           </motion.div>
        </div>
        
        {/* Animated Glow Border Divider at very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"></div>
      </section>

      <section id="about"><About /></section>
      <section id="skills"><Skills /></section>
      <section id="projects"><Projects /></section>
      <section id="experience"><Experience /></section>
      <section id="certifications"><Certifications /></section>
      <section id="blog"><Blog /></section>
      <section id="socials"><Social /></section>
      <section id="contact"><Contact /></section>
    </>
  );
};

export default Home;
