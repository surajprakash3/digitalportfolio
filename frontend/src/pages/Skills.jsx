import React, { Component, useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll } from 'framer-motion';
import { Code2, Users, Wrench, Lightbulb } from 'lucide-react';
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
        className="flex-shrink-0 flex flex-col items-center justify-center p-3 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] bg-theme-bg/60 backdrop-blur-md rounded-2xl border border-theme-border shadow-theme-glow-sm transition-all duration-300 cursor-pointer relative group/icon hover:border-accent-500/50"
      >
        {!showFallback ? (
          <motion.img
            src={iconSrc}
            alt={skill.name}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain relative z-10"
            onError={() => {
              if (hasStoredIcon) setImgError(true);
              else setDeviconError(true);
            }}
            whileHover={{ scale: 1.1 }}
            style={{ transform: "translateZ(30px)" }}
          />
        ) : (
          <span className="text-2xl sm:text-3xl font-bold text-accent-400 relative z-10" style={{ transform: "translateZ(30px)" }}>
            {skill.name ? skill.name.charAt(0).toUpperCase() : '?'}
          </span>
        )}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-theme-muted opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none bg-theme-card/90 px-2 py-1 rounded-md border border-theme-border shadow-lg z-30 tracking-widest uppercase">
          {skill.name}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategoryCard = ({ category, isFullWidth }) => {
  if (!category || !category.icon) return null;
  const IconComponent = category.icon;
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`bg-theme-card/40 backdrop-blur-xl p-8 rounded-3xl border border-theme-border shadow-theme-glow-sm hover:shadow-theme-glow transition-all duration-500 ${isFullWidth ? 'md:col-span-2' : ''}`}
    >
      <div className="flex items-center gap-5 mb-10">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.gradient || 'from-slate-500 to-slate-400'} text-white shadow-lg shadow-accent-500/20`}>
          <IconComponent size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-bold font-heading text-theme-text">{category.title}</h3>
          <p className="text-xs font-bold text-theme-muted uppercase tracking-widest mt-1">{category.subtitle}</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isFullWidth ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-10`}>
        {(category.groups || []).map((group, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <h4 className="text-sm font-bold text-theme-text flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
              {group.name}
            </h4>
            <div className="flex flex-wrap gap-4">
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
        <div className="py-20 text-center bg-theme-card/20 backdrop-blur-md rounded-3xl border border-theme-border m-4">
          <h2 className="text-xl font-bold text-theme-text mb-2">Something went wrong</h2>
          <p className="text-theme-muted">The skills section failed to load. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Skills = () => {
  const { data, loading } = useSkills();
  const dbSkills = typeof data === 'object' && Array.isArray(data) ? data : [];

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
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <ErrorBoundary>
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-theme-text mb-4">
            Expertise & <span className="text-gradient">Skills</span>
          </h2>
          <div className="w-20 h-1.5 bg-accent-500 rounded-full mx-auto mb-6"></div>
          <p className="text-theme-muted max-w-2xl mx-auto text-lg">
            A comprehensive overview of my technical capabilities and professional strengths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} category={cat} isFullWidth={cat.span} />
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default Skills;
