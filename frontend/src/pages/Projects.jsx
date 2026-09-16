import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { getImageUrl } from '../utils/imageUtils';

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.2 }
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const ProjectCard = ({ project }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1.15", "1 1"]
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col h-full border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/40 hover:shadow-xl hover:-translate-y-1 relative z-10 w-full"
    >
          {/* Spotlight Effect Overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.08), transparent 40%)`,
              opacity: isHovered ? 1 : 0
            }}
          />

          {/* Dimming overlay when hovered */}
          <div className={`absolute inset-0 bg-slate-900/5 dark:bg-black/20 z-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

          {/* Inner glow and soft border overlays for premium glass effect */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none border border-theme-border mix-blend-overlay z-20"></div>
          <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] z-20"></div>

          {project.image && (
            <motion.div variants={imageVariants} className="relative overflow-hidden h-36 sm:h-40 w-full shrink-0 z-10">
              <div className="absolute inset-0 bg-transparent group-hover:bg-theme-bg/30 transition-colors duration-700 ease-out z-10 pointer-events-none"></div>
              <img
                src={getImageUrl(project.image)}
                alt={project.title}
                className="w-full h-full object-cover object-top transform group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </motion.div>
          )}

          <motion.div variants={contentVariants} className="p-3.5 sm:p-4 flex flex-col flex-grow relative z-10">
            <h3 className="text-base sm:text-lg font-bold font-heading text-theme-text mb-1.5 group-hover:text-accent-500 transition-colors z-10 relative line-clamp-2">
              {project.title}
            </h3>

            {/* Description with Read More / Show Less and Scroll */}
            <div className="mb-3 flex-grow flex flex-col justify-start z-10 relative">
              <div
                className={`text-xs text-theme-muted leading-relaxed transition-all duration-300 ${
                  isExpanded
                    ? 'max-h-32 overflow-y-auto pr-1 custom-scrollbar'
                    : 'line-clamp-3'
                }`}
              >
                {project.description}
              </div>
              {project.description && project.description.length > 90 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="self-start mt-1 text-xs font-semibold text-accent-500 hover:text-accent-400 inline-flex items-center gap-0.5 transition-colors cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>

            <motion.div
              className="flex flex-wrap gap-1 mb-3 z-10 relative"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {(project.techStack || project.technologies || []).map((tech) => (
                <motion.span
                  key={tech}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "var(--theme-glow)",
                    borderColor: "transparent",
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="px-2 py-0.5 text-[11px] font-semibold text-theme-text bg-theme-bg/50 backdrop-blur-sm rounded-md border border-theme-border shadow-sm transition-colors duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            <div className="grid grid-cols-2 gap-2 mt-auto pt-2.5 border-t border-theme-border z-10 relative">
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, boxShadow: "var(--theme-glow)" }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-accent-600 via-accent-400 to-accent-600 animate-gradient text-white transition-all duration-300 font-semibold text-xs shadow-md border border-transparent overflow-hidden relative"
                >
                  <ExternalLink size={14} className="mr-1 group-hover:translate-x-0.5 transition-transform duration-300" />
                  Live Demo
                </motion.a>
              )}
              {project.githubLink && (
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, boxShadow: "var(--theme-glow-sm)" }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-theme-card text-theme-text transition-all duration-300 font-semibold text-xs border border-theme-border shadow-sm"
                >
                  <Github size={14} className="mr-1 group-hover:translate-x-0.5 transition-transform duration-300" />
                  Codebase
                </motion.a>
              )}
            </div>
          </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const { data, loading, error } = useProjects();
  const projects = data || [];
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -330 : 330;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div className="inline-block">
          <motion.h1
            className="text-3xl md:text-4xl font-bold font-heading text-theme-text mb-3 flex flex-wrap"
          >
            {["Featured", "Projects"].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`inline-block mr-[0.3em] ${word === "Projects" ? "text-gradient animate-gradient" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1.5 bg-accent-500 rounded-full"
          ></motion.div>
        </div>

        {/* Horizontal Navigation Buttons */}
        <div className="flex items-center gap-2 pb-1">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-nowrap overflow-x-auto gap-5 pb-4 pt-1 scrollbar-hide">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-[270px] sm:w-[310px] md:w-[330px] shrink-0 bg-theme-card/50 border border-theme-border rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="w-full h-36 sm:h-40 bg-theme-border/50"></div>
              <div className="p-3.5 sm:p-4">
                <div className="h-4 bg-theme-border/50 rounded w-3/4 mb-2.5"></div>
                <div className="space-y-1.5 mb-3">
                  <div className="h-3 bg-theme-border/50 rounded w-full"></div>
                  <div className="h-3 bg-theme-border/50 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 bg-theme-border/50 rounded w-12"></div>
                  <div className="h-4 bg-theme-border/50 rounded w-14"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex flex-nowrap overflow-x-auto gap-5 pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {projects.map((project) => (
            <div key={project._id} className="w-[270px] sm:w-[310px] md:w-[330px] shrink-0 snap-start flex flex-col">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
