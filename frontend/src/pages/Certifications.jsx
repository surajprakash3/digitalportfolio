import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { useCertifications } from '../hooks/useCertifications';
import { getImageUrl } from '../utils/imageUtils';
import SEO from '../components/SEO';

const Certifications = () => {
  const { data, loading, error } = useCertifications();
  const certifications = data || [];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-slate-200 dark:bg-dark-700 rounded-lg mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-slate-200 dark:bg-dark-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Certifications" description="My professional certifications and licenses" url="/certifications" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-4">
            Licenses & <span className="text-gradient">Certifications</span>
          </h1>
          <div className="w-20 h-1.5 bg-accent-500 rounded-full mx-auto md:mx-0 mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto md:mx-0">
            Professional credentials and verified achievements demonstrating my expertise.
          </p>
        </motion.div>

        {certifications.length === 0 ? (
          <div className="text-center py-20 px-4 glass rounded-3xl">
            <Award className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Certifications Yet</h3>
            <p className="text-slate-500">I'm currently working on acquiring new credentials. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {certifications.map((cert) => (
              <motion.div
                key={cert._id}
                variants={itemVariants}
                className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-dark-700/50 hover:shadow-xl hover:shadow-accent-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 relative overflow-hidden group"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-accent-500/10 dark:bg-accent-500/20 rounded-full blur-2xl group-hover:bg-accent-500/20 dark:group-hover:bg-accent-500/30 transition-colors"></div>

                {/* Logo */}
                <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-white/50 dark:bg-dark-800/50 flex items-center justify-center p-3 border border-slate-200/50 dark:border-dark-700/50 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {cert.logo ? (
                    <img src={getImageUrl(cert.logo)} alt={cert.issuer} className="w-full h-full object-contain drop-shadow-sm" />
                  ) : (
                    <Award size={32} className="text-slate-400 group-hover:text-accent-500 transition-colors" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2 leading-tight">
                    {cert.name}
                  </h3>
                  <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mb-3">{cert.issuer}</p>

                  <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 text-slate-400 dark:text-slate-500" />
                      Issued {cert.issueDate}
                      {cert.expiryDate ? (
                        <>
                          <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
                          Expires {cert.expiryDate}
                        </>
                      ) : null}
                    </div>
                    {cert.credentialId && (
                      <div className="font-mono text-xs bg-slate-100 dark:bg-dark-800 px-2 py-1 rounded w-fit border border-slate-200 dark:border-dark-700">
                        Credential ID: <span className="text-slate-700 dark:text-slate-300">{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-sm font-bold text-accent-600 dark:text-accent-400 group/link"
                    >
                      Show credential
                      <ExternalLink size={14} className="ml-1.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Certifications;
