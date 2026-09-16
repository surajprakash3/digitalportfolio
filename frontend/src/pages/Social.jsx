import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe, Github, Linkedin, Twitter, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeCategories = useMemo(() => {
    const list = [];
    CATEGORIES.forEach(cat => {
      const items = socials.filter(s => s.category === cat);
      if (items.length > 0) list.push({ name: cat, items });
    });
    const otherItems = socials.filter(s => !CATEGORIES.includes(s.category));
    if (otherItems.length > 0) {
      list.push({ name: 'Other', items: otherItems });
    }
    return list;
  }, [socials]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen -z-10 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen -z-10 animate-blob animation-delay-2000 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-theme-text mb-3">
              Connect & <span className="text-gradient">Social</span>
            </h2>
            <div className="w-16 h-1.5 bg-accent-500 rounded-full mb-3"></div>
            <p className="text-theme-muted max-w-2xl text-sm sm:text-base">
              Connect with me across coding, learning, and professional communities.
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

        {socials.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <Globe className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 font-heading">No platforms found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Social links will appear here once added by the admin.</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex flex-nowrap overflow-x-auto gap-5 pb-5 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {activeCategories.map(({ name, items }) => (
              <div
                key={name}
                className="bg-theme-card/40 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-theme-border shadow-theme-glow-sm hover:shadow-theme-glow transition-all duration-300 w-[260px] sm:w-[290px] md:w-[320px] shrink-0 snap-start flex flex-col h-full"
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-theme-border/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                  <h3 className="text-sm sm:text-base font-bold font-heading text-theme-text truncate">
                    {name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2.5 flex-grow">
                  {items.map((item) => (
                    <motion.a
                      key={item._id}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.platform ? `${item.platform}${item.handle ? ` (${item.handle})` : ''}` : 'Social Link'}
                      className="group flex flex-col items-center justify-center w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] bg-theme-bg/60 backdrop-blur-sm rounded-xl border border-theme-border hover:border-accent-500/50 shadow-sm transition-all duration-300 relative"
                    >
                      <SocialIcon platform={item.platform} icon={item.icon} className="w-5 h-5 text-theme-text group-hover:text-accent-500 transition-colors" />
                      <span className="text-[10px] font-semibold text-theme-muted group-hover:text-accent-500 truncate max-w-[52px] mt-1 text-center">
                        {item.platform || 'Link'}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;
