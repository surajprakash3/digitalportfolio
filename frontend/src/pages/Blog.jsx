import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublishedPosts } from '../services/api';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPublishedPosts({ search, tag: selectedTag });
        setPosts(data.posts || []);

        // Extract unique tags
        const tags = new Set();
        (data.posts || []).forEach(p => p.tags?.forEach(t => tags.add(t)));
        setAllTags([...tags]);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [search, selectedTag]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const BASE_URL = API_URL.replace('/api', '');
    return `${BASE_URL}${url}`;
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Read articles about web development, programming, and technology by Suraj Prakash"
        url="/blog"
      />
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-theme-text mb-4">
            Blog & <span className="text-gradient">Articles</span>
          </h1>
          <p className="text-lg text-theme-muted max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development and technology
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-theme-bg border border-theme-border text-theme-text placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition shadow-sm"
              id="blog-search"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${!selectedTag
                    ? 'bg-accent-500 text-white border-transparent'
                    : 'bg-theme-bg text-theme-muted hover:bg-theme-border/50 border-theme-border'
                  }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${selectedTag === tag
                      ? 'bg-accent-500 text-white border-transparent'
                      : 'bg-theme-bg text-theme-muted hover:bg-theme-border/50 border-theme-border'
                    }`}
                >
                  <Tag size={12} className="inline mr-1" />{tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-theme-muted">
            <p className="text-lg">No articles found.</p>
            <p className="text-sm mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <motion.article key={post._id} variants={itemVariants}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block h-full bg-theme-card/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-theme-border shadow-sm hover:shadow-theme-glow hover:border-accent-500 transition-all duration-300"
                >
                  {post.coverImage && (
                    <LazyImage
                      src={getImageUrl(post.coverImage)}
                      alt={post.title}
                      className="w-full h-48 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="p-5 bg-theme-bg/30">
                    <div className="flex items-center gap-2 text-xs text-theme-muted mb-3">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </div>
                    <h2 className="text-lg font-semibold text-theme-text mb-2 group-hover:text-accent-500 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-theme-muted line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="inline-flex items-center text-sm font-medium text-accent-500 group-hover:text-accent-600 transition-colors">
                      Read more <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
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
