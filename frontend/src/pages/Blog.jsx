import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublishedBlogPosts } from '../hooks/useBlog';
import { getImageUrl } from '../utils/imageUtils';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';

const Blog = () => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const scrollRef = useRef(null);

  const { data: blogData, loading } = usePublishedBlogPosts({ search, tag: selectedTag });
  const posts = blogData?.posts || [];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -330 : 330;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return [...tags];
  }, [posts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Read articles about web development, programming, and technology by Suraj Prakash"
        url="/blog"
      />
      <section id="blog" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-theme-text mb-2">
                Blog & <span className="text-gradient">Articles</span>
              </h2>
              <div className="w-16 h-1.5 bg-accent-500 rounded-full mb-2"></div>
              <p className="text-xs sm:text-sm text-theme-muted max-w-xl">
                Thoughts, tutorials, and practical insights on modern web development and cloud technologies.
              </p>
            </motion.div>
          </div>

          {/* Search bar & Nav Arrows */}
          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-theme-bg border border-theme-border text-theme-text placeholder-theme-muted focus:outline-none focus:ring-1 focus:ring-accent-500 transition shadow-sm"
                id="blog-search"
              />
            </div>

            {/* Scroll Navigation */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll articles left"
                className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll articles right"
                className="p-2 rounded-lg bg-theme-card border border-theme-border text-theme-muted hover:text-accent-500 hover:border-accent-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Tag Pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition border ${
                !selectedTag
                  ? 'bg-accent-500 text-white border-transparent'
                  : 'bg-theme-bg text-theme-muted hover:bg-theme-border/50 border-theme-border'
              }`}
            >
              All
            </button>
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition border ${
                  selectedTag === tag
                    ? 'bg-accent-500 text-white border-transparent'
                    : 'bg-theme-bg text-theme-muted hover:bg-theme-border/50 border-theme-border'
                }`}
              >
                <Tag size={10} className="inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Posts Row */}
        {loading ? (
          <div className="flex flex-nowrap overflow-x-auto gap-5 pb-4 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 w-[280px] sm:w-[320px] shrink-0 bg-slate-200 dark:bg-dark-700 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl text-theme-muted text-sm">
            <p>No articles found matching your criteria.</p>
          </div>
        ) : (
          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-nowrap overflow-x-auto gap-5 pb-5 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {posts.map((post) => (
              <motion.article
                key={post._id}
                variants={itemVariants}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between h-full bg-theme-card/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-theme-border shadow-sm hover:shadow-theme-glow hover:border-accent-500/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {post.coverImage && (
                      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100 dark:bg-dark-800">
                        <LazyImage
                          src={getImageUrl(post.coverImage)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-theme-muted mb-2">
                        <Calendar size={11} />
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-theme-text mb-1.5 group-hover:text-accent-500 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-theme-muted line-clamp-2 mb-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 border-t border-theme-border/50 flex items-center justify-between">
                    {post.tags?.length > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 border border-accent-100 dark:border-accent-900/30 truncate max-w-[150px]">
                        {post.tags[0]}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center text-xs font-semibold text-accent-500 group-hover:text-accent-600 transition-colors">
                      Read <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
};

export default Blog;
