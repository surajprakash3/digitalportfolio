import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useBlogPost } from '../hooks/useBlog';
import { getImageUrl } from '../utils/imageUtils';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: post, loading, error } = useBlogPost(slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{error || 'Post not found'}</h2>
        <Link to="/blog" className="text-accent-500 hover:text-accent-600 inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Back to blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        type="article"
        image={getImageUrl(post.coverImage) || '/og-image.png'}
      />
      <article className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-accent-500 hover:text-accent-600 mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to blog
          </Link>

          {/* Cover image */}
          {post.coverImage && (
            <LazyImage
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-64 md:h-80 rounded-2xl mb-8"
            />
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <User size={14} /> {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 text-sm">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-accent-500 hover:prose-a:text-accent-600 prose-img:rounded-xl prose-pre:bg-slate-900 dark:prose-pre:bg-dark-900 prose-code:text-accent-600 dark:prose-code:text-accent-400">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </motion.div>
      </article>
    </>
  );
};

export default BlogDetail;
