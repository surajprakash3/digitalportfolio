import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Briefcase, Calendar, GraduationCap, MapPin, ExternalLink } from 'lucide-react';
import { useExperiences } from '../hooks/useExperiences';
import { getImageUrl } from '../utils/imageUtils';
import AnimatedBackground from '../components/AnimatedBackground';

const Experience = () => {
  const { data, loading, error } = useExperiences();
  const experiences = data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const workExperiences = experiences.filter(e => (!e.type || e.type === 'work'));
  const educationExperiences = experiences.filter(e => e.type === 'education');

  const TimelineEntry = ({ item, isWork, index }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // Spotlight and hover macro parallax tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.5 });
    const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.5 });
    
    const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(255,255,255,0.08), transparent 40%)`;

    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["0 1.2", "1 0.4"] // Grows from 0 to 1 as card enters view
    });
    
    // Scale timeline line to track scroll progress
    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
    
    // Semantic scroll parallax (timeline text slides independently of static line)
    const cardScrollY = useTransform(scrollYProgress, [0, 1], [25, -25]);
    
    // Scroll-based entry (scale + opacity)
    const cardScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
    const cardOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

    const entryVariants = {
      hidden: { x: isWork ? -80 : 80 },
      visible: { 
        x: 0, 
        transition: { 
          duration: 0.6, 
          ease: "easeOut", 
          delay: index * 0.15,
          when: "beforeChildren",
          staggerChildren: 0.1
        } 
      }
    };

    const iconVariants = {
      hidden: { scale: 0, rotate: -30, opacity: 0 },
      visible: { 
        scale: 1, 
        rotate: 0, 
        opacity: 1,
        transition: { type: "spring", stiffness: 400, damping: 20, delay: index * 0.15 + 0.1 } 
      }
    };

    const textVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };
    
    const dateVariants = {
      hidden: { opacity: 0, y: -15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    return (
      <motion.div 
        ref={ref}
        key={item._id} 
        variants={entryVariants} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative pl-8 md:pl-16 pb-12 last:pb-0 group/timeline"
        style={{ scale: cardScale, opacity: cardOpacity }}
      >
        {/* Static Background Vertical line connector for path */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-theme-border hidden md:block" style={{ left: '23px' }}></div>
        
        {/* Animated Fill Vertical line connector overlaying path */}
        <motion.div 
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-500 hidden md:block origin-top shadow-[0_0_10px_rgba(6,182,212,0.8)] z-0" 
          style={{ left: '23px', scaleY }}
        ></motion.div>
        
        {/* Timeline dot/icon/logo */}
        <motion.div 
          variants={iconVariants}
          className="absolute -left-[17px] md:left-0 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-2xl bg-theme-bg border-[1.5px] border-accent-500 shadow-theme-glow-sm z-10 transition-all duration-300 hover:scale-110 overflow-hidden group/icon hover:shadow-theme-glow cursor-pointer"
        >
          {/* Internal Glow Pulse inside icon */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/20 to-blue-500/20 animate-pulse group-hover/icon:from-accent-500/40 group-hover/icon:to-blue-500/40 pointer-events-none transition-colors duration-300"></div>
          {item.logo ? (
            <img src={getImageUrl(item.logo)} alt={item.company} className="w-full h-full object-contain p-1.5 relative z-10" />
          ) : (
            <div className="text-accent-500 relative z-10">
              {isWork ? <Briefcase size={18} /> : <GraduationCap size={18} />}
            </div>
          )}
        </motion.div>

        {/* Content card Parallax & Floating Wrapper */}
        <motion.div 
          style={{ y: cardScrollY }}
          className="relative z-20"
        >
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ 
                y: -10, 
                scale: 1.02, 
                boxShadow: "var(--theme-glow-lg)",
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="bg-theme-card/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl relative transition-all duration-300 border border-theme-border shadow-theme-glow-sm group-hover/timeline:shadow-theme-glow overflow-hidden"
            >
            
            {/* Spotlight Gradient Layer */}
            <motion.div 
              className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: spotlightBackground,
                opacity: isHovered ? 1 : 0
              }}
            />
            {/* Background Dimming */}
            <div className={`absolute inset-0 bg-slate-900/5 dark:bg-black/10 z-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Animated Gradient Border */}
            <div 
              className={`absolute inset-0 rounded-3xl pointer-events-none border-[1px] border-transparent bg-gradient-to-r from-accent-500/50 via-blue-500/50 to-accent-500/50 bg-[length:200%_auto] animate-gradient z-20 transition-opacity duration-500`}
              style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", opacity: isHovered ? 1 : 0.4 }}
            ></div>

        {/* Inner glow layers */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/50 dark:border-white/20 mix-blend-overlay z-20"></div>
        <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] z-20"></div>

        <div className="relative z-30">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <motion.div variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-1">
              <motion.h3 variants={textVariants} className="text-xl md:text-2xl font-bold font-heading text-theme-text group-hover:text-accent-500 transition-colors">
                {item.role}
              </motion.h3>
              <motion.div variants={textVariants} className="flex flex-wrap items-center gap-2 text-base font-semibold text-theme-muted">
                <span>{item.company}</span>
                {item.type === 'work' && item.employmentType && (
                  <span className="text-theme-muted font-medium px-2 py-0.5 bg-theme-bg rounded-md text-xs uppercase tracking-wider">
                    {item.employmentType}
                  </span>
                )}
                {item.type === 'education' && item.grade && (
                  <span className="text-accent-500 font-bold px-2 py-0.5 bg-accent-50 dark:bg-accent-900/20 rounded-md text-xs border border-accent-100 dark:border-accent-900/30">
                    Grade: {item.grade}
                  </span>
                )}
              </motion.div>
            </motion.div>
            
            <motion.div variants={dateVariants} className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                className="flex items-center text-accent-600 dark:text-accent-400 font-bold bg-accent-50 dark:bg-accent-900/20 px-4 py-1.5 rounded-xl text-sm border border-accent-100 dark:border-accent-900/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all cursor-default"
              >
                <Calendar size={14} className="mr-2" />
                {item.duration}
              </motion.div>
              {item.location && (
                <div className="flex items-center text-xs text-slate-500 font-medium">
                  <MapPin size={12} className="mr-1" />
                  {item.location} {item.locationType && `(${item.locationType})`}
                </div>
              )}
            </motion.div>
          </div>

          {item.activities && (
            <motion.div variants={textVariants} className="mb-4 p-3 bg-theme-bg/50 rounded-xl border border-theme-border">
              <p className="text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-1">Activities & Societies</p>
              <p className="text-sm text-theme-muted italic">
                {item.activities}
              </p>
            </motion.div>
          )}

          <motion.p variants={textVariants} className="text-theme-muted leading-relaxed text-base mb-6 border-l-2 border-theme-border pl-4">
            {item.description}
          </motion.p>

          <motion.div variants={textVariants} className="flex flex-wrap items-end justify-between gap-6">
          {item.skills?.length > 0 && (
            <div className="flex-1">
              <p className="text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-3">Core Skills & Expertise</p>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 text-xs font-bold text-theme-text bg-theme-bg rounded-lg border border-theme-border shadow-sm hover:border-accent-500/30 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:scale-105 transition-all shadow-lg active:scale-95">
              View Project <ExternalLink size={16} />
            </a>
          )}
        </motion.div>
        </div>
      </motion.div>
      </motion.div>
    </motion.div>
    </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-block">
            <motion.h1
              className="text-4xl md:text-5xl font-bold font-heading text-theme-text mb-4 flex flex-wrap justify-center"
            >
              {["Experience", "&", "Education"].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className={`inline-block mr-[0.3em] ${word === "Education" ? "text-gradient animate-gradient" : ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-1.5 bg-accent-500 rounded-full"
            ></motion.div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No experiences found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
            
            {/* Work Experience Section */}
            <div>
              <motion.h2 variants={itemVariants} className="text-2xl font-bold font-heading text-theme-text mb-8 flex items-center gap-3">
                <Briefcase className="text-accent-500" />
                Work Experience
              </motion.h2>
              {workExperiences.length > 0 ? (
                <div className="relative border-none ml-4 md:ml-6 space-y-10">
                  {workExperiences.map((item, index) => <TimelineEntry key={item._id} item={item} isWork={true} index={index} />)}
                </div>
              ) : (
                <p className="text-slate-500 pl-4">No work experience listed.</p>
              )}
            </div>

            {/* Education Section */}
            <div>
              <motion.h2 variants={itemVariants} className="text-2xl font-bold font-heading text-theme-text mb-8 flex items-center gap-3">
                <GraduationCap className="text-accent-500" />
                Education
              </motion.h2>
              {educationExperiences.length > 0 ? (
                <div className="relative border-none ml-4 md:ml-6 space-y-10">
                  {educationExperiences.map((item, index) => <TimelineEntry key={item._id} item={item} isWork={false} index={index} />)}
                </div>
              ) : (
                <p className="text-slate-500 pl-4">No education history listed.</p>
              )}
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Experience;
