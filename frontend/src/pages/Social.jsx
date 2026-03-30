import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import { useSocials } from '../hooks/useSocials';
import { getImageUrl } from '../utils/imageUtils';

const CATEGORIES = [
  'Professional Platforms',
  'Coding Platforms',
  'Community Platforms',
  'Personal Platforms',
  'Other'
];

const SocialIcon = ({ platform, icon, className }) => {
  const [imgError, setImgError] = useState(false);
  const localIcon = getImageUrl(icon);
  
  if (localIcon && !imgError) {
    return <img src={localIcon} alt={platform || 'Social'} className={`${className} object-contain`} onError={() => setImgError(true)} />;
  }

  const p = (platform || '').toLowerCase();
  if (p.includes('github')) return <Github className={className} />;
  if (p.includes('linkedin')) return <Linkedin className={className} />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter className={className} />;
  if (p.includes('mail')) return <Mail className={className} />;

  return <Globe className={className} />;
};

const Social = () => {
  const { data, loading, error } = useSocials();
  const socials = data || [];

  const getCategorized = (category) => {
    return socials.filter(s => s.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen -z-10 animate-blob"></div>
      <div className="absolute bottom-40 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen -z-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative"
        >
          <div className="inline-block relative">
            {/* Glow pill around title like in screenshot */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-500/20 to-indigo-500/20 blur"></div>
            <h1 className="relative px-8 py-3 bg-white/5 dark:bg-dark-900/40 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-dark-700/50 text-4xl font-bold font-heading text-slate-900 dark:text-white">
              Social
            </h1>
          </div>
          <p className="mt-8 text-slate-600 dark:text-slate-400 max-w-2xl text-lg relative z-10">
            Connect with me across coding, learning, and professional communities.
          </p>
        </motion.div>

        {socials.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl">
            <Globe className="mx-auto h-16 w-16 text-slate-400 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">No platforms found</h3>
            <p className="text-slate-500 dark:text-slate-400">Social links will appear here once added by the admin.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-16">
            {CATEGORIES.map(category => {
              const items = getCategorized(category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="relative z-10">
                  {/* Category Header */}
                  <motion.div variants={itemVariants} className="flex items-center mb-8 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-slate-200/50 to-transparent dark:from-dark-700/50 dark:to-transparent rounded-full blur opacity-50"></div>
                    <h2 className="relative px-6 py-2.5 bg-white/40 dark:bg-dark-800/40 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-dark-700/50 text-2xl font-bold text-slate-900 dark:text-white inline-block font-heading shadow-sm">
                      {category}
                    </h2>
                    <div className="h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-dark-700 dark:to-transparent flex-1 ml-4"></div>
                  </motion.div>

                  {/* Cards Grid */}
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {items.map((item) => (
                      <motion.a
                        key={item._id}
                        variants={itemVariants}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.platform ? `${item.platform}${item.handle ? ` (${item.handle})` : ''}` : 'Social Link'}
                        className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/60 dark:bg-dark-800/40 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm hover:shadow-xl hover:shadow-accent-500/10 hover:border-accent-500/50 dark:hover:border-accent-500/50 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-accent-500 transition-colors">
                          <SocialIcon url={item.url} platform={item.platform} icon={item.icon} className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Social;
