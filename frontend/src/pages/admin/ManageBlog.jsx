import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAllBlogPosts } from '../../hooks/useBlog';
import * as blogService from '../../services/blogService';

const ManageBlog = () => {
  const { data, loading, refetch: fetchPosts } = useAllBlogPosts();
  const posts = data || [];
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', tags: '', published: false });

  const resetForm = () => {
    setForm({ title: '', content: '', excerpt: '', tags: '', published: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('excerpt', form.excerpt);
    formData.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
    formData.append('published', form.published);
    if (form.coverImage) formData.append('coverImage', form.coverImage);

    try {
      if (editing) {
        await updateBlogPost(editing, formData);
      } else {
        await createBlogPost(formData);
      }
      resetForm();
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving post');
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags?.join(', ') || '',
      published: post.published,
    });
    setEditing(post._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await deleteBlogPost(id);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting post');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Manage Blog</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-slate-200 dark:border-dark-700 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {editing ? 'Edit Post' : 'New Post'}
            </h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <input
            type="text" placeholder="Post title" required value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          />
          <input
            type="text" placeholder="Excerpt (short description)" required value={form.excerpt}
            onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          />
          <textarea
            placeholder="Content (Markdown supported)" required value={form.content} rows={8}
            onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50 font-mono text-sm"
          />
          <input
            type="text" placeholder="Tags (comma-separated)" value={form.tags}
            onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          />
          <input
            type="file" accept="image/*,.svg"
            onChange={(e) => setForm(f => ({ ...f, coverImage: e.target.files[0] }))}
            className="text-sm text-slate-500"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox" checked={form.published}
              onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))}
              className="rounded border-slate-300"
            />
            Publish immediately
          </label>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition">
            {editing ? 'Update' : 'Create'} Post
          </button>
        </motion.form>
      )}

      {/* Posts list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No blog posts yet.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="flex items-center justify-between bg-white dark:bg-dark-800 rounded-xl px-5 py-4 border border-slate-200 dark:border-dark-700">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-900 dark:text-white truncate">{post.title}</h4>
                  {post.published ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs flex items-center gap-1">
                      <Check size={10} /> Live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-700 text-slate-500 text-xs">Draft</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 truncate mt-0.5">{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => handleEdit(post)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-700 text-slate-500 transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(post._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageBlog;
