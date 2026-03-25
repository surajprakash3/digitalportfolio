import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { getProjects } from '../services/api';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', '');
  return `${BASE_URL}${url}`;
};

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
      ref={cardRef}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className="h-full"
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="h-full"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{
            y: -10,
            scale: 1.02,
            boxShadow: "var(--theme-glow-lg)",
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
          className="bg-theme-card/60 backdrop-blur-2xl rounded-3xl overflow-hidden group transition-all duration-300 flex flex-col h-full border border-theme-border shadow-theme-glow-sm relative z-10"
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
            <motion.div variants={imageVariants} className="relative overflow-hidden aspect-video z-10">
              <div className="absolute inset-0 bg-transparent group-hover:bg-theme-bg/30 transition-colors duration-700 ease-out z-10 pointer-events-none"></div>
              <img
                src={getImageUrl(project.image)}
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </motion.div>
          )}

          <motion.div variants={contentVariants} className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
            <h3 className="text-2xl font-bold font-heading text-theme-text mb-3 group-hover:text-accent-500 transition-colors z-10 relative">
              {project.title}
            </h3>
            <p className="text-theme-muted mb-6 flex-grow leading-relaxed z-10 relative">
              {project.description}
            </p>

            <motion.div
              className="flex flex-wrap gap-2 mb-8 z-10 relative"
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
                    scale: 1.1,
                    boxShadow: "var(--theme-glow)",
                    borderColor: "transparent",
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-theme-text bg-theme-bg/50 backdrop-blur-sm rounded-xl border border-theme-border shadow-sm transition-colors duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-theme-border z-10 relative">
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "var(--theme-glow)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-600 via-accent-400 to-accent-600 animate-gradient text-white transition-all duration-300 font-semibold text-sm shadow-lg border border-transparent overflow-hidden relative"
                >
                  <ExternalLink size={18} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Live Demo
                </motion.a>
              )}
              {project.githubLink && (
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "var(--theme-glow-sm)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center justify-center px-4 py-2.5 rounded-xl bg-theme-card text-theme-text transition-all duration-300 font-semibold text-sm border border-theme-border shadow-sm"
                >
                  <Github size={18} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Codebase
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center md:text-left mb-16 flex flex-col items-center md:items-start">
        <div className="inline-block">
          <motion.h1
            className="text-4xl md:text-5xl font-bold font-heading text-theme-text mb-4 flex flex-wrap justify-center md:justify-start"
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
      </div>

      {error && (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-theme-card/50 border border-theme-border rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="w-full h-64 bg-theme-border/50"></div>
              <div className="p-8">
                <div className="h-6 bg-theme-border/50 rounded w-3/4 mb-4"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-theme-border/50 rounded w-full"></div>
                  <div className="h-4 bg-theme-border/50 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-theme-border/50 rounded w-16"></div>
                  <div className="h-6 bg-theme-border/50 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
