import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll } from 'framer-motion';
import { Code2, Users, Wrench, Lightbulb } from 'lucide-react';
import { getSkills } from '../services/api';

const isValidIcon = (iconStr) => {
  return iconStr && iconStr !== 'null' && iconStr !== 'undefined' && iconStr.trim() !== '';
};

// Map skill names to devicon identifiers for auto-generated icons
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
  'vs code': 'vscode', 'visual studio': 'visualstudio',
  'tailwind': 'tailwindcss', 'tailwindcss': 'tailwindcss', 'tailwind css': 'tailwindcss',
};

const getDeviconUrl = (skillName) => {
  const key = skillName.toLowerCase().trim();
  const deviconName = DEVICON_MAP[key];
  if (deviconName) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconName}/${deviconName}-original.svg`;
  }
  return null;
};

const SkillItem = ({ skill, getImageUrl }) => {
  const [imgError, setImgError] = useState(false);
  const [deviconError, setDeviconError] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-12px", "12px"]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-12px", "12px"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const childVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, type: "spring", stiffness: 100 } },
  };

  // Determine the icon source: stored icon > devicon > first letter fallback
  const hasStoredIcon = isValidIcon(skill.icon) && !imgError;
  const deviconUrl = getDeviconUrl(skill.name);
  const hasDevicon = deviconUrl && !deviconError;
  const iconSrc = hasStoredIcon ? getImageUrl(skill.icon) : (hasDevicon ? deviconUrl : null);

  return (
    <motion.div variants={childVariants} className="relative z-20">
      <motion.div
        style={{
          x: translateX,
          y: translateY,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15
        }}
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            y: {
              duration: 3 + (skill.name.length % 3 * 0.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (skill.name.length % 5) * 0.2
            },
            type: "spring",
            stiffness: 400,
            damping: 10
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px 2px rgba(56, 189, 248, 0.4)",
            borderColor: "rgba(56, 189, 248, 0.6)",
            z: 40
          }}
          className="flex-shrink-0 flex flex-col items-center justify-center p-3 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] bg-theme-bg backdrop-blur-sm rounded-2xl border border-theme-border shadow-theme-glow-sm transition-colors cursor-pointer relative group/icon"
        >
          {iconSrc ? (
            <motion.img
              src={iconSrc}
              alt={skill.name}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain relative z-10"
              onError={() => {
                if (hasStoredIcon) setImgError(true);
                else setDeviconError(true);
              }}
              whileHover={{
                rotate: [0, -10, 10, 0],
                scale: 1.15
              }}
              transition={{
                rotate: { duration: 0.5, repeat: Infinity, repeatType: "mirror" },
                scale: { type: "spring", stiffness: 300 }
              }}
              style={{
                transform: "translateZ(30px)"
              }}
            />
          ) : (
            <span className="text-2xl sm:text-3xl font-bold text-accent-400 relative z-10" style={{ transform: "translateZ(30px)" }}>
              {skill.name.charAt(0).toUpperCase()}
            </span>
          )}
          {/* Skill name tooltip */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-theme-muted opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none bg-theme-card/90 px-2 py-1 rounded-md border border-theme-border shadow-lg z-30">
            {skill.name}
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/10 to-blue-500/10 opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

const CategoryCard = ({ category, idx, isFullWidth, getImageUrl }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowColors = {
    "Technical Skills": "rgba(56, 189, 248, 0.4)",
    "Core / Soft Skills": "rgba(16, 185, 129, 0.4)",
    "Tools & Technologies": "rgba(245, 158, 11, 0.4)",
    "Additional Skills": "rgba(168, 85, 247, 0.4)"
  };
  const borderGlows = {
    "Technical Skills": "rgba(56, 189, 248, 0.8)",
    "Core / Soft Skills": "rgba(16, 185, 129, 0.8)",
    "Tools & Technologies": "rgba(245, 158, 11, 0.8)",
    "Additional Skills": "rgba(168, 85, 247, 0.8)"
  };

  const IconComponent = category.icon;

  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const scrollScale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.85, 1, 1, 0.85]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        boxShadow: [
          `0 10px 20px -15px ${glowColors[category.title] || "rgba(56, 189, 248, 0.2)"}`,
          `0 15px 30px -10px ${glowColors[category.title] || "rgba(56, 189, 248, 0.25)"}`,
          `0 10px 20px -15px ${glowColors[category.title] || "rgba(56, 189, 248, 0.2)"}`
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        scale: scrollScale,
        opacity: scrollOpacity,
      }}
      whileHover={{
        scale: 1.03,
        y: -10,
        boxShadow: `0 35px 70px -15px ${glowColors[category.title] || "rgba(56, 189, 248, 0.4)"}`,
        borderColor: borderGlows[category.title] || "rgba(56, 189, 248, 0.8)",
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={`bg-theme-card/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl relative group border border-theme-border shadow-theme-glow-lg overflow-hidden transition-colors duration-500 ${isFullWidth ? 'md:col-span-2' : ''}`}
    >
      {/* Animated Border Background */}
      <div className="absolute inset-0 p-[1.5px] rounded-3xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_160deg,#22d3ee_180deg,#3b82f6_200deg,transparent_220deg,transparent_360deg)] group-hover:animate-[spin_3s_linear_infinite]"
        />
      </div>

      {/* Internal Glass Layer to cover the rotating border center with inner shadow */}
      <div className="absolute inset-[1.5px] bg-theme-card/90 rounded-[1.45rem] -z-10 group-hover:bg-theme-card/50 transition-colors duration-500 shadow-[inset_0_2px_15px_rgba(255,255,255,0.1)]"></div>

      {/* Subtle Background Gradient Overlay */}
      <div className={`absolute -inset-2 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-opacity duration-500 rounded-[2.5rem  blur-xl-none -z-10`}></div>

      <div className="flex items-center gap-5 mb-12 relative z-10" style={{ transform: "translateZ(50px)" }}>
        <motion.div
          whileHover={{
            scale: 1.15,
            rotate: 8,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15
          }}
          className={`p-4 rounded-2xl bg-gradient-to-br ${category.gradient} shadow-md shadow-slate-200/50 dark:shadow-none text-white transition-shadow duration-500`}
        >
          <IconComponent size={32} strokeWidth={1.5} />
        </motion.div>
        <div>
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
            className="text-2xl sm:text-3xl font-bold font-heading tracking-tight flex flex-wrap premium-title-hover"
          >
            {category.title.split(" ").map((word, wordIdx) => (
              <motion.span
                key={wordIdx}
                className="mr-2 inline-block whitespace-nowrap"
              >
                {word.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.h3>
          {category.subtitle && (
            <p className="text-sm font-semibold text-theme-muted uppercase tracking-widest mt-1.5">{category.subtitle}</p>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isFullWidth ? 'md:grid-cols-2 lg:grid-cols-3 gap-x-12' : 'sm:grid-cols-1 md:grid-cols-1 gap-x-8'} gap-y-12 relative z-10`} style={{ transform: "translateZ(30px)" }}>
        {category.groups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            {/* Group Header */}
            <h4 className="text-[15px] font-bold text-theme-text flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
              {group.name}
              <div className="flex-grow border-t border-theme-border ml-2"></div>
            </h4>

            {/* Mixed Skills Cards & Text */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 sm:gap-4 items-center"
            >
              {group.skills.map((skill, skillIdx) => (
                <SkillItem key={skillIdx} skill={skill} getImageUrl={getImageUrl} />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const BackgroundBlobs = ({ x, y }) => (
  <motion.div
    style={{ x, y }}
    className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-30 dark:opacity-20 animate-pulse-slow"
  >
    <motion.div
      animate={{
        x: [0, 80, 0],
        y: [0, 40, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[100px]"
    />
    <motion.div
      animate={{
        x: [0, -80, 0],
        y: [0, 80, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, 40, 0],
        y: [0, -60, 0],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 35,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]"
    />
  </motion.div>
);

const Skills = () => {
  const [dbSkills, setDbSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global mouse tracking for parallax
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const mXSpring = useSpring(mX, { damping: 50, stiffness: 400 });
  const mYSpring = useSpring(mY, { damping: 50, stiffness: 400 });

  const bgX = useTransform(mXSpring, [-0.5, 0.5], ["30px", "-30px"]);
  const bgY = useTransform(mYSpring, [-0.5, 0.5], ["30px", "-30px"]);
  const contentX = useTransform(mXSpring, [-0.5, 0.5], ["-10px", "10px"]);
  const contentY = useTransform(mYSpring, [-0.5, 0.5], ["-10px", "10px"]);

  // Spotlight hooks MUST be at the top level
  const sX = useTransform(mXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const sY = useTransform(mYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightGradient = useMotionTemplate`radial-gradient(800px circle at ${sX} ${sY}, rgba(34, 211, 238, 0.15), transparent 80%)`;

  const handleGlobalMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mX.set((clientX / innerWidth) - 0.5);
    mY.set((clientY / innerHeight) - 0.5);
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setDbSkills(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load skills', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const parsedCategories = useMemo(() => {
    const buildCategory = (title, subtitle, icon, gradient, catName, span) => {
      const skills = dbSkills.filter(s => s.category === catName);
      const groupMap = {};

      skills.forEach(skill => {
        const gName = skill.group || 'General';
        if (!groupMap[gName]) groupMap[gName] = [];
        groupMap[gName].push({ name: skill.name, icon: skill.icon, proficiency: skill.proficiency });
      });

      const groups = Object.keys(groupMap).map(name => ({
        name,
        skills: groupMap[name]
      }));

      return { title, subtitle, icon, gradient, span, groups };
    };

    return [
      buildCategory("Technical Skills", "Primary Focus", Code2, "from-blue-500 to-cyan-400", "Technical Skills", true),
      buildCategory("Core / Soft Skills", "Interpersonal & Professional", Users, "from-emerald-500 to-teal-400", "Core / Soft Skills", false),
      buildCategory("Tools & Technologies", "Development & Productivity", Wrench, "from-amber-500 to-orange-400", "Tools & Technologies", false),
      buildCategory("Additional Skills", "Versatility & Growth", Lightbulb, "from-purple-500 to-pink-400", "Additional Skills", false)
    ].filter(c => c.groups.length > 0);
  }, [dbSkills]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (dbSkills.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center relative overflow-hidden">
        <BackgroundBlobs x={bgX} y={bgY} />
        <h2 className="text-3xl font-bold font-heading text-theme-text mb-4">Expertise & <span className="text-gradient">Skills</span></h2>
        <div className="bg-theme-card/60 backdrop-blur-lg p-12 rounded-3xl max-w-2xl mx-auto border border-theme-border shadow-theme-glow-sm">
          <p className="text-theme-text text-lg">No skills have been added yet.</p>
          <p className="text-sm text-theme-muted mt-2">Add your skills through the Admin Dashboard to see them beautifully categorized here.</p>
        </div>
      </div>
    );
  }

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative overflow-hidden group"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        style={{ background: spotlightGradient }}
      />

      <BackgroundBlobs x={bgX} y={bgY} />
      <motion.div
        style={{ x: contentX, y: contentY }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="w-full"
        >
          <div className="text-center mb-16">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="text-4xl md:text-5xl font-extrabold font-heading text-theme-text mb-4 tracking-tight relative inline-block group premium-title-hover"
            >
              {"Expertise & ".split(" ").map((word, wIdx) => (
                <motion.span key={wIdx} className="mr-3 inline-block">
                  {word.split("").map((char, cIdx) => (
                    <motion.span
                      key={cIdx}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              ))}
              <span className="text-gradient inline-block">
                {"Skills".split("").map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h2>
            <motion.div variants={itemVariants} className="w-24 h-1.5 bg-accent-500 rounded-full mx-auto"></motion.div>
            <motion.p variants={itemVariants} className="mt-4 text-theme-muted max-w-2xl mx-auto text-lg leading-relaxed">
              A comprehensive overview of my technical capabilities, professional core strengths, and preferred development tools.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">

            {parsedCategories.map((category, idx) => (
              <CategoryCard
                key={idx}
                category={category}
                idx={idx}
                isFullWidth={category.span}
                getImageUrl={getImageUrl}
                itemVariants={itemVariants}
              />
            ))}

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Skills;
