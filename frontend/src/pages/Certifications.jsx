import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCertifications } from '../hooks/useCertifications';
import { getImageUrl } from '../utils/imageUtils';
import SEO from '../components/SEO';

const Certifications = () => {
  const { data, loading, error } = useCertifications();
  const certifications = data || [];
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -330 : 330;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-44 bg-slate-200 dark:bg-dark-700 rounded-lg mb-8"></div>
          <div className="flex flex-nowrap overflow-x-auto gap-5 pb-4 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 w-[280px] sm:w-[330px] shrink-0 bg-slate-200 dark:bg-dark-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Certifications" description="My professional certifications and licenses" url="/certifications" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                Licenses & <span className="text-gradient">Certifications</span>
              </h1>
              <div className="w-16 h-1.5 bg-accent-500 rounded-full mb-3"></div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                Professional credentials and verified achievements demonstrating my expertise.
              </p>
            </motion.div>
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

        {certifications.length === 0 ? (
          <div className="text-center py-16 px-4 glass rounded-2xl">
            <Award className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">No Certifications Yet</h3>
            <p className="text-slate-500 text-sm">I'm currently working on acquiring new credentials. Check back soon!</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex flex-nowrap overflow-x-auto gap-5 pb-5 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {certifications.map((cert) => (
              <motion.div
                key={cert._id}
                variants={itemVariants}
                className="glass rounded-2xl p-4 sm:p-5 border border-slate-200/50 dark:border-dark-700/50 hover:shadow-xl hover:shadow-accent-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-4 relative overflow-hidden group w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-accent-500/10 dark:bg-accent-500/20 rounded-full blur-2xl group-hover:bg-accent-500/20 dark:group-hover:bg-accent-500/30 transition-colors"></div>

                {/* Logo */}
                <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-white/50 dark:bg-dark-800/50 flex items-center justify-center p-2 border border-slate-200/50 dark:border-dark-700/50 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {cert.logo ? (
                    <img src={getImageUrl(cert.logo)} alt={cert.issuer} className="w-full h-full object-contain drop-shadow-sm" />
                  ) : (
                    <Award size={24} className="text-slate-400 group-hover:text-accent-500 transition-colors" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mb-0.5 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2 leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{cert.issuer}</p>

                  <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center text-[11px]">
                      <Calendar size={12} className="mr-1.5 text-slate-400 dark:text-slate-500" />
                      Issued {cert.issueDate}
                      {cert.expiryDate ? (
                        <>
                          <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                          Expires {cert.expiryDate}
                        </>
                      ) : null}
                    </div>
                    {cert.credentialId && (
                      <div className="font-mono text-[10px] bg-slate-100 dark:bg-dark-800 px-2 py-0.5 rounded w-fit border border-slate-200 dark:border-dark-700">
                        ID: <span className="text-slate-700 dark:text-slate-300">{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-xs font-bold text-accent-600 dark:text-accent-400 group/link"
                    >
                      Show credential
                      <ExternalLink size={12} className="ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Certifications;
