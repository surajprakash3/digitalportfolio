import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Twitter } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { getImageUrl } from '../utils/imageUtils';
import { downloadResume } from '../services/resumeService';
import SEO from '../components/SEO';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Certifications from './Certifications';
import Blog from './Blog';
import Social from './Social';
import Contact from './Contact';

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
      <span className="inline-block w-[3px] h-[1.1em] bg-accent-500 ml-[2px] rounded-full animate-pulse" />
    </span>
  );
};

const Home = () => {
  const { data: profile, loading } = useProfile();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
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
        className="relative pt-12 pb-10 md:pt-16 md:pb-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden min-h-[80vh] flex items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-center w-full z-10 relative">

          {/* Mobile Profile Photo (Centered, compact, visible immediately on small screens) */}
          {profileImage && (
            <div className="md:hidden flex justify-center -mb-2">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-tr from-accent-500 to-blue-500 shadow-xl shadow-accent-500/20">
                <img
                  src={getImageUrl(profileImage)}
                  alt={name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Left Column: Text & Accents */}
          <motion.div
            className="md:col-span-7 flex flex-col justify-center text-center md:text-left relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Headers */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading mb-2 tracking-tight leading-tight relative z-20">
              <motion.span variants={itemVariants} className="inline-block mr-2 text-theme-text">Hi, I'm</motion.span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-accent-300 to-blue-500 relative inline-block pb-0.5">{name}</span>
            </h1>

            <motion.h2 variants={itemVariants} className="text-lg sm:text-xl font-bold opacity-90 mb-3 font-heading flex flex-wrap items-center justify-center md:justify-start gap-2 h-7 sm:h-8 overflow-hidden">
               <span className="text-theme-muted">I am a </span> <Typewriter words={titleWords} />
            </motion.h2>

            {/* Impact Statement */}
            <motion.div variants={itemVariants} className="mb-4 text-theme-muted max-w-lg mx-auto md:mx-0">
              <p className="font-semibold text-theme-text text-sm sm:text-base leading-relaxed">
                {tagline}
              </p>
              {shortDescription && shortDescription !== tagline && (
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-theme-muted mt-1">{shortDescription}</p>
              )}
            </motion.div>

            {/* Premium Animated Stats Section */}
            <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 mb-5 border-y border-theme-border/40 py-2 w-full md:w-max mx-auto md:mx-0">
              <motion.div variants={statVariants} className="flex flex-col items-center md:items-start group">
                 <span className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-300">{stats.projects}</span>
                 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Projects</span>
              </motion.div>
              <div className="w-px h-7 bg-theme-border/40"></div>
              <motion.div variants={statVariants} className="flex flex-col items-center md:items-start group">
                 <span className="text-lg sm:text-xl font-black text-theme-text">{stats.experience}</span>
                 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Experience</span>
              </motion.div>
              <div className="w-px h-7 bg-theme-border/40"></div>
              <motion.div variants={statVariants} className="flex flex-col items-center md:items-start group">
                 <span className="text-lg sm:text-xl font-black text-theme-text">{stats.contributions}</span>
                 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Contributions</span>
              </motion.div>
            </motion.div>

            {/* Call to Actions Enhancement */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <motion.a 
                href="#projects" 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-bold text-white overflow-hidden rounded-xl border border-transparent shadow-md shadow-accent-500/20 w-full sm:w-auto cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 via-accent-400 to-accent-600 bg-[length:200%_auto] animate-gradient z-0"></div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-0"></div>
                <span className="relative z-10 flex items-center">
                  View My Work
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </motion.a>
              
              <motion.button 
                type="button"
                onClick={() => downloadResume(resumeUrl)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-bold text-theme-text transition-all duration-300 bg-theme-card/60 backdrop-blur-md hover:bg-theme-bg/80 hover:text-accent-500 rounded-xl border border-theme-border w-full sm:w-auto shadow-sm tracking-wide cursor-pointer" 
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download CV
              </motion.button>
            </motion.div>

            {/* Social Links under CTA */}
            <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-2.5 mt-4">
                {socials?.githubUrl && (
                    <motion.a whileHover={{ y: -2, scale: 1.08 }} title='GitHub' href={socials.githubUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-colors">
                        <Github size={15} />
                    </motion.a>
                )}
                {socials?.linkedinUrl && (
                    <motion.a whileHover={{ y: -2, scale: 1.08 }} title='LinkedIn' href={socials.linkedinUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-colors">
                        <Linkedin size={15} />
                    </motion.a>
                )}
                {socials?.twitterUrl && (
                    <motion.a whileHover={{ y: -2, scale: 1.08 }} title='Twitter' href={socials.twitterUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-colors">
                        <Twitter size={15} />
                    </motion.a>
                )}
            </motion.div>
          </motion.div>

          {/* Desktop Right Column: Image */}
          <motion.div
            className="hidden md:flex md:col-span-5 relative items-center justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            {/* Ambient Backdrop Glow */}
            <div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-accent-500/20 to-accent-300/10 blur-[80px] rounded-full -z-10 pointer-events-none" 
            />

            <div className="relative w-full aspect-[4/5] max-w-[240px] lg:max-w-[270px] group">
              {/* Glowing Border Behind Profile */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-600 via-blue-500 to-accent-400 rounded-2xl opacity-30 blur-md group-hover:opacity-60 transition-opacity"></div>
              
              {/* Main Profile Glass Card */}
              <div className="w-full h-full bg-theme-card/60 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-theme-border/50 relative transition-transform duration-300 group-hover:-translate-y-1">
                <div className="w-full h-full rounded-xl overflow-hidden relative bg-theme-bg shadow-inner">
                  {profileImage ? (
                    <img
                      src={getImageUrl(profileImage)}
                      alt={name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-theme-muted bg-theme-bg/50">
                      <span className="font-medium text-base mb-2">No Image Found</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Years of Experience Chip */}
              {(stats.experience) && (
                <div
                  className="absolute -bottom-3 -left-3 bg-theme-card/95 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 border border-theme-border/60 z-20 cursor-default"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                    {String(stats.experience).split('+')[0].split(' ')[0]}+
                  </div>
                  <div>
                    <p className="text-[8px] text-theme-muted font-bold tracking-wider uppercase leading-tight">Years</p>
                    <p className="font-bold text-theme-text text-[11px] leading-tight">Experience</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator & Glowing Target Divider */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-20">
           <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-theme-muted mb-1 opacity-50">Scroll</span>
           <motion.div
             animate={{ y: [0, 6, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="w-5 h-8 border-2 border-theme-muted/40 rounded-full flex justify-center p-0.5 backdrop-blur-sm"
           >
             <motion.div 
                animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
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
