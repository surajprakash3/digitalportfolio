import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Code2, MapPin, GraduationCap, Briefcase, Zap } from 'lucide-react';
import { getProfile } from '../services/api';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return null; // Wait to load, Home.jsx handles initial skeleton

  const about = profile?.about || {
      paragraph1: 'I am a passionate Full Stack Developer and Cloud Enthusiast focused on building scalable and efficient web applications.',
      paragraph2: 'I specialize in modern technologies like React, Node.js, and cloud platforms, with a strong emphasis on performance, clean architecture, and user experience.',
      paragraph3: 'I continuously improve my skills by building real-world projects, solving complex problems, and staying updated with the latest technologies.',
      skillsSummary: 'React, Node.js, MongoDB, AWS, Docker',
      focusArea: 'Full Stack Development & Cloud Engineering',
      personalStatement: 'Driven by curiosity, powered by code.',
      quickInfo: { location: 'Remote', education: 'B.Tech CS', experience: '3+ Years' },
      highlights: ['Problem Solving', 'Teamwork', 'Learning Mindset']
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-4">
          About <span className="text-accent-500">Me</span>
        </h2>
        <div className="w-20 h-1.5 bg-accent-500 rounded-full mx-auto"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* Left Column - Biography */}
        <div className="lg:col-span-7 space-y-6">
            <motion.div variants={itemVariants} className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-6">
                <p className="text-xl font-medium text-slate-800 dark:text-slate-100 italic border-l-4 border-accent-500 pl-4 py-1">
                    "{about.personalStatement}"
                </p>
                <p>{about.paragraph1}</p>
                <p>{about.paragraph2}</p>
                <p>{about.paragraph3}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6 mt-8 border-t border-theme-border flex flex-wrap gap-3">
                {about.highlights?.map((highlight, index) => (
                    <span key={index} className="px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-sm font-bold text-accent-500 shadow-sm flex items-center gap-2 transition-transform hover:-translate-y-1">
                        <Zap size={14}/> {highlight}
                    </span>
                ))}
            </motion.div>
        </div>

        {/* Right Column - Glass Cards */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* Focus Area Card */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass p-6 rounded-2xl border border-theme-border/50 shadow-lg relative overflow-hidden group transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-[40px] group-hover:bg-accent-500/20 transition-colors"></div>
                <div className="flex items-start gap-4 mb-2 relative z-10">
                    <div className="p-3 bg-accent-500/10 text-accent-500 rounded-xl shrink-0"><Target size={24}/></div>
                    <div>
                        <h3 className="text-sm font-bold text-theme-muted uppercase tracking-wider mb-1">Primary Focus</h3>
                        <p className="text-lg font-bold text-theme-text bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-blue-500">
                            {about.focusArea}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Skills Summary Card */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass p-6 rounded-2xl border border-theme-border/50 shadow-lg relative overflow-hidden group transition-all duration-300">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="flex items-start gap-4 mb-2 relative z-10">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0"><Code2 size={24}/></div>
                    <div>
                        <h3 className="text-sm font-bold text-theme-muted uppercase tracking-wider mb-1">Top Technologies</h3>
                        <p className="text-base font-semibold text-theme-text leading-snug">
                            {about.skillsSummary}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Quick Info Grid Card */}
            <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border border-theme-border/50 shadow-lg">
                <div className="space-y-5">
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-theme-bg flex items-center justify-center text-theme-muted border border-theme-border group-hover:border-accent-500 group-hover:text-accent-500 transition-colors"><MapPin size={18}/></div>
                        <div>
                            <p className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">Location</p>
                            <p className="text-sm font-bold text-theme-text">{about.quickInfo?.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-theme-bg flex items-center justify-center text-theme-muted border border-theme-border group-hover:border-accent-500 group-hover:text-accent-500 transition-colors"><GraduationCap size={18}/></div>
                        <div>
                            <p className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">Education</p>
                            <p className="text-sm font-bold text-theme-text">{about.quickInfo?.education}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-theme-bg flex items-center justify-center text-theme-muted border border-theme-border group-hover:border-accent-500 group-hover:text-accent-500 transition-colors"><Briefcase size={18}/></div>
                        <div>
                            <p className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">Experience</p>
                            <p className="text-sm font-bold text-theme-text">{about.quickInfo?.experience}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default About;
