import React, { Component, useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll } from 'framer-motion';
import { Code2, Users, Wrench, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSkills } from '../hooks/useSkills';
import { getImageUrl } from '../utils/imageUtils';

const isValidIcon = (iconStr) => {
  return iconStr && iconStr !== 'null' && iconStr !== 'undefined' && iconStr.trim() !== '';
};

const DEVICON_MAP = {
  'html': 'html5', 'html5': 'html5', 'css': 'css3', 'css3': 'css3',
  'javascript': 'javascript', 'js': 'javascript', 'typescript': 'typescript', 'ts': 'typescript',
  'react': 'react', 'react.js': 'react', 'reactjs': 'react', 'react native': 'react',
  'next.js': 'nextjs', 'nextjs': 'nextjs', 'next': 'nextjs',
  'vue': 'vuejs', 'vue.js': 'vuejs', 'vuejs': 'vuejs',
  'angular': 'angular', 'angularjs': 'angularjs',
  'svelte': 'svelte', 'node': 'nodejs', 'node.js': 'nodejs', 'nodejs': 'nodejs',
  'express': 'express', 'express.js': 'express', 'expressjs': 'express',
  'python': 'python', 'java': 'java', 'c': 'c', 'c++': 'cplusplus', 'cpp': 'cplusplus',
  'c#': 'csharp', 'csharp': 'csharp', 'go': 'go', 'golang': 'go',
  'rust': 'rust', 'ruby': 'ruby', 'php': 'php', 'swift': 'swift',
  'kotlin': 'kotlin', 'dart': 'dart', 'flutter': 'flutter', 'r': 'r',
  'mongodb': 'mongodb', 'mongo': 'mongodb', 'mysql': 'mysql',
  'postgresql': 'postgresql', 'postgres': 'postgresql',
  'redis': 'redis', 'sqlite': 'sqlite', 'firebase': 'firebase',
  'docker': 'docker', 'kubernetes': 'kubernetes', 'k8s': 'kubernetes',
  'aws': 'amazonwebservices', 'azure': 'azure', 'gcp': 'googlecloud', 'google cloud': 'googlecloud',
  'git': 'git', 'github': 'github', 'gitlab': 'gitlab', 'bitbucket': 'bitbucket',
  'linux': 'linux', 'ubuntu': 'ubuntu', 'bash': 'bash',
  'nginx': 'nginx', 'apache': 'apache',
  'figma': 'figma', 'sketch': 'sketch', 'photoshop': 'photoshop',
  'illustrator': 'illustrator', 'xd': 'xd',
  'tailwind': 'tailwindcss', 'tailwindcss': 'tailwindcss', 'tailwind css': 'tailwindcss',
  'bootstrap': 'bootstrap', 'sass': 'sass', 'scss': 'sass', 'less': 'less',
  'webpack': 'webpack', 'vite': 'vitejs', 'babel': 'babel',
  'npm': 'npm', 'yarn': 'yarn', 'pnpm': 'pnpm',
  'jest': 'jest', 'mocha': 'mocha', 'cypress': 'cypressio',
  'graphql': 'graphql', 'rest api': 'fastapi', 'fastapi': 'fastapi',
  'django': 'django', 'flask': 'flask', 'spring': 'spring', 'spring boot': 'spring',
  'laravel': 'laravel', 'rails': 'rails', 'ruby on rails': 'rails',
  'tensorflow': 'tensorflow', 'pytorch': 'pytorch',
  'pandas': 'pandas', 'numpy': 'numpy', 'jupyter': 'jupyter',
  'heroku': 'heroku', 'vercel': 'vercel', 'netlify': 'netlify',
  'jira': 'jira', 'confluence': 'confluence', 'trello': 'trello',
  'slack': 'slack', 'vscode': 'vscode', 'visual studio code': 'vscode',
  'intellij': 'intellij', 'android': 'android', 'ios': 'apple',
  'unity': 'unity', 'unreal': 'unrealengine',
  'three.js': 'threejs', 'threejs': 'threejs',
  'socket.io': 'socketio', 'socketio': 'socketio',
  'postman': 'postman', 'insomnia': 'insomnia',
  'material ui': 'materialui', 'mui': 'materialui',
  'redux': 'redux', 'mobx': 'mobx',
  'electron': 'electron', 'deno': 'denojs',
  'supabase': 'supabase', 'prisma': 'prisma',
  'mongoose': 'mongoose',
  'vs code': 'vscode', 'visual studio': 'visualstudio'
};

const getDeviconUrl = (skillName) => {
  if (!skillName) return null;
  const key = skillName.toLowerCase().trim();
  const deviconName = DEVICON_MAP[key];
  if (deviconName) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconName}/${deviconName}-original.svg`;
  }
  return null;
};

const SkillItem = ({ skill }) => {
  if (!skill || !skill.name) return null;
  
  const [imgError, setImgError] = useState(false);
  const [deviconError, setDeviconError] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const hasStoredIcon = isValidIcon(skill.icon);
  const deviconUrl = !hasStoredIcon ? getDeviconUrl(skill.name) : null;
  const iconSrc = hasStoredIcon ? getImageUrl(skill.icon) : deviconUrl;
  const showFallback = (!iconSrc || (hasStoredIcon && imgError) || (!hasStoredIcon && deviconError));

  return (
    <motion.div
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="flex-shrink-0 flex flex-col items-center justify-center p-2 w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] bg-theme-bg/60 backdrop-blur-md rounded-xl border border-theme-border shadow-theme-glow-sm transition-all duration-300 cursor-pointer relative group/icon hover:border-accent-500/50"
      >
        {!showFallback ? (
          <motion.img
            src={iconSrc}
            alt={skill.name}
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain relative z-10"
            onError={() => {
              if (hasStoredIcon) setImgError(true);
              else setDeviconError(true);
            }}
            whileHover={{ scale: 1.1 }}
            style={{ transform: "translateZ(30px)" }}
          />
        ) : (
          <span className="text-lg sm:text-xl font-bold text-accent-400 relative z-10" style={{ transform: "translateZ(30px)" }}>
            {skill.name ? skill.name.charAt(0).toUpperCase() : '?'}
          </span>
        )}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-theme-muted opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none bg-theme-card/90 px-2 py-0.5 rounded border border-theme-border shadow-lg z-30 tracking-wider uppercase">
          {skill.name}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategoryCard = ({ category }) => {
  if (!category || !category.icon) return null;
  const IconComponent = category.icon;
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="bg-theme-card/40 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-theme-border shadow-theme-glow-sm hover:shadow-theme-glow transition-all duration-500 w-[260px] sm:w-[290px] md:w-[320px] shrink-0 snap-start flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${category.gradient || 'from-slate-500 to-slate-400'} text-white shadow-md shadow-accent-500/20`}>
          <IconComponent size={20} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-theme-text">{category.title}</h3>
          <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">{category.subtitle}</p>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        {(category.groups || []).map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <h4 className="text-[11px] font-bold text-theme-text flex items-center gap-1.5 uppercase tracking-wider text-theme-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
              {group.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(group.skills || []).map((skill, sIdx) => (
                <SkillItem key={sIdx} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { 
    console.error("Skills Section Error:", error, errorInfo); 
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="py-16 text-center bg-theme-card/20 backdrop-blur-md rounded-2xl border border-theme-border m-4">
          <h2 className="text-lg font-bold text-theme-text mb-2">Something went wrong</h2>
          <p className="text-theme-muted text-sm">The skills section failed to load. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Skills = () => {
  const { data, loading } = useSkills();
  const dbSkills = typeof data === 'object' && Array.isArray(data) ? data : [];
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = useMemo(() => {
    const build = (title, subtitle, icon, gradient, catName, span) => {
      const skills = dbSkills.filter(s => s && s.category === catName);
      if (skills.length === 0) return null;

      const groupMap = {};
      skills.forEach(s => {
        const gName = s.group || 'General';
        if (!groupMap[gName]) groupMap[gName] = [];
        groupMap[gName].push(s);
      });

      return {
        title, subtitle, icon, gradient, span,
        groups: Object.entries(groupMap).map(([name, skills]) => ({ name, skills }))
      };
    };

    return [
      build("Technical Skills", "Primary Expertise", Code2, "from-blue-500 to-cyan-400", "Technical Skills", true),
      build("Core / Soft Skills", "Professional Qualities", Users, "from-emerald-500 to-teal-400", "Core / Soft Skills", false),
      build("Tools & Technologies", "Workflow & Ecosystem", Wrench, "from-amber-500 to-orange-400", "Tools & Technologies", false),
      build("Additional Skills", "Versatility", Lightbulb, "from-purple-500 to-pink-400", "Additional Skills", false)
    ].filter(Boolean);
  }, [dbSkills]);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <ErrorBoundary>
      <section id="skills" className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-theme-text mb-3">
              Expertise & <span className="text-gradient">Skills</span>
            </h2>
            <div className="w-16 h-1.5 bg-accent-500 rounded-full mb-3"></div>
            <p className="text-theme-muted max-w-2xl text-sm sm:text-base">
              A comprehensive overview of my technical capabilities and professional strengths.
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2 pb-1 shrink-0 ml-4">
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

        <div
          ref={scrollRef}
          className="flex flex-nowrap overflow-x-auto gap-5 pb-5 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} category={cat} />
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default Skills;
