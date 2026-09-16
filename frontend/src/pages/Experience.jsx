import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  GraduationCap,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import { useExperiences } from '../hooks/useExperiences';
import { useProfile } from '../hooks/useProfile';
import { getImageUrl } from '../utils/imageUtils';
import { downloadResume } from '../services/resumeService';
import SEO from '../components/SEO';

const ExperienceCard = ({ item, isWork }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 border border-slate-200/50 dark:border-dark-700/50 hover:shadow-xl hover:shadow-accent-500/5 transition-all duration-300 flex flex-col justify-between w-[290px] sm:w-[340px] md:w-[370px] shrink-0 snap-start relative overflow-hidden group"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500/30 via-accent-500 to-accent-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header with Logo and Details */}
        <div className="flex items-start gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-xl bg-accent-500/10 dark:bg-accent-500/20 border border-accent-500/20 flex items-center justify-center shrink-0 overflow-hidden text-accent-500">
            {item.logo ? (
              <img
                src={getImageUrl(item.logo)}
                alt={item.company}
                className="w-full h-full object-contain p-1"
              />
            ) : isWork ? (
              <Briefcase size={18} />
            ) : (
              <GraduationCap size={18} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold font-heading text-theme-text truncate group-hover:text-accent-500 transition-colors">
              {item.role}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-theme-muted mt-0.5">
              <span className="font-semibold truncate max-w-[150px]">{item.company}</span>
              {item.type === 'work' && item.employmentType && (
                <span className="text-[10px] px-1.5 py-0.5 bg-theme-bg rounded border border-theme-border font-medium uppercase tracking-wider">
                  {item.employmentType}
                </span>
              )}
              {item.type === 'education' && item.grade && (
                <span className="text-[10px] text-accent-500 font-bold px-1.5 py-0.5 bg-accent-50 dark:bg-accent-900/20 rounded border border-accent-100 dark:border-accent-900/30">
                  Grade: {item.grade}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Duration & Location Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center text-[11px] font-semibold text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20 px-2.5 py-1 rounded-full border border-accent-100 dark:border-accent-900/30">
            <Calendar size={12} className="mr-1.5" />
            {item.duration}
          </div>
          {item.location && (
            <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <MapPin size={11} className="mr-1" />
              <span className="truncate max-w-[130px]">
                {item.location} {item.locationType && `(${item.locationType})`}
              </span>
            </div>
          )}
        </div>

        {/* Activities (for Education) */}
        {item.activities && (
          <div className="mb-3 p-2 bg-theme-bg/60 rounded-lg border border-theme-border text-xs">
            <p className="text-[9px] font-bold text-theme-muted uppercase tracking-wider mb-0.5">Activities & Societies</p>
            <p className="text-theme-muted italic line-clamp-2">{item.activities}</p>
          </div>
        )}

        {/* Description with Read more toggle & custom-scrollbar */}
        {item.description && (
          <div className="mb-3">
            <div
              className={`text-xs text-theme-muted leading-relaxed transition-all duration-300 ${
                isExpanded
                  ? 'max-h-32 overflow-y-auto pr-1 custom-scrollbar'
                  : 'line-clamp-3'
              }`}
            >
              {item.description}
            </div>
            {item.description.length > 90 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs font-semibold text-accent-500 hover:text-accent-400 inline-flex items-center gap-0.5 transition-colors cursor-pointer"
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
        )}
      </div>

      {/* Footer: Skills & External Link */}
      <div className="pt-3 border-t border-theme-border/60 mt-2">
        {item.skills && item.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[10px] font-semibold text-theme-text bg-theme-bg rounded border border-theme-border"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-500 hover:text-accent-400 transition-colors mt-1"
          >
            <span>View Details</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const { data, loading } = useExperiences();
  const { data: profile } = useProfile();
  const experiences = data || [];

  const workScrollRef = useRef(null);
  const eduScrollRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const workExperiences = experiences.filter((e) => !e.type || e.type === 'work');
  const educationExperiences = experiences.filter((e) => e.type === 'education');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-slate-200 dark:bg-dark-700 rounded-lg"></div>
          <div className="flex flex-nowrap overflow-x-auto gap-5 pb-4 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 w-[300px] shrink-0 bg-slate-200 dark:bg-dark-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Experience & Education" description="My professional work experience and academic background" url="/experience" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Page Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              Experience & <span className="text-gradient">Education</span>
            </h1>
            <div className="w-16 h-1.5 bg-accent-500 rounded-full mb-3"></div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              My professional journey, roles, career milestones, and educational background.
            </p>
          </motion.div>
        </div>

        {/* Work Experience Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent-500/10 text-accent-500">
                <Briefcase size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-theme-text">
                Work Experience
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-theme-bg border border-theme-border text-theme-muted">
                {workExperiences.length}
              </span>
            </div>

            {/* Scroll Navigation */}
            {workExperiences.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll(workScrollRef, 'left')}
                  aria-label="Scroll work experience left"
                  className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scroll(workScrollRef, 'right')}
                  aria-label="Scroll work experience right"
                  className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {workExperiences.length === 0 ? (
            <div className="text-center py-10 px-4 glass rounded-2xl text-slate-500 text-sm">
              No work experience listed yet.
            </div>
          ) : (
            <div
              ref={workScrollRef}
              className="flex flex-nowrap overflow-x-auto gap-5 pb-5 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {workExperiences.map((item) => (
                <ExperienceCard key={item._id} item={item} isWork={true} />
              ))}
            </div>
          )}
        </div>

        {/* Education Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent-500/10 text-accent-500">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-theme-text">
                Education
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-theme-bg border border-theme-border text-theme-muted">
                {educationExperiences.length}
              </span>
            </div>

            {/* Scroll Navigation */}
            {educationExperiences.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll(eduScrollRef, 'left')}
                  aria-label="Scroll education left"
                  className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scroll(eduScrollRef, 'right')}
                  aria-label="Scroll education right"
                  className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {educationExperiences.length === 0 ? (
            <div className="text-center py-10 px-4 glass rounded-2xl text-slate-500 text-sm">
              No education history listed yet.
            </div>
          ) : (
            <div
              ref={eduScrollRef}
              className="flex flex-nowrap overflow-x-auto gap-5 pb-5 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {educationExperiences.map((item) => (
                <ExperienceCard key={item._id} item={item} isWork={false} />
              ))}
            </div>
          )}
        </div>

        {/* Resume / CV Download Banner */}
        <div className="mt-12 glass p-5 rounded-2xl border border-theme-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
              <Download size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-theme-text">Looking for my full credentials?</h3>
              <p className="text-xs text-theme-muted">Download my complete CV with detailed career history, skills, and references.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => downloadResume(profile?.hero?.resumeUrl)}
            className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-accent-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Download size={15} />
            Download Complete CV
          </button>
        </div>
      </div>
    </>
  );
};

export default Experience;
