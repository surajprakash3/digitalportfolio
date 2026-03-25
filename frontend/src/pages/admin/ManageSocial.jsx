import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Globe, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { getSocials, createSocial, updateSocial, deleteSocial } from '../../services/api';

const CATEGORIES = [
  'Professional Platforms',
  'Coding Platforms',
  'Community Platforms',
  'Personal Platforms',
  'Other'
];

const ManageSocialImage = ({ social, getImageUrl, isValidIcon }) => {
  const [imgError, setImgError] = useState(false);
  const valid = isValidIcon(social.icon) && !imgError;

  return valid ? (
    <img src={getImageUrl(social.icon)} alt={social.platform || 'Social'} className="w-full h-full object-contain" onError={() => setImgError(true)} />
  ) : (
    <Globe size={20} className="text-slate-400" />
  );
};

const ManageSocial = () => {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    platform: '',
    handle: '',
    url: '',
    category: 'Professional Platforms',
    icon: null
  });

  const fetchSocials = async () => {
    try {
      const data = await getSocials();
      setSocials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching socials:', err);
      setSocials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const resetForm = () => {
    setForm({
      platform: '',
      handle: '',
      url: '',
      category: 'Professional Platforms',
      icon: null
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('platform', form.platform);
      formData.append('handle', form.handle);
      formData.append('url', form.url);
      formData.append('category', form.category);
      if (form.icon) {
        formData.append('icon', form.icon);
      }

      if (editing) {
        await updateSocial(editing, formData);
      } else {
        await createSocial(formData);
      }
      resetForm();
      fetchSocials();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving social link');
    }
  };

  const handleEdit = (social) => {
    setForm({
      platform: social.platform,
      handle: social.handle,
      url: social.url,
      category: social.category || 'Professional Platforms',
      icon: null
    });
    setEditing(social._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;
    try {
      await deleteSocial(id);
      fetchSocials();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting social link');
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const BASE_URL = API_URL.replace('/api', '');
    return `${BASE_URL}${url}`;
  };

  const isValidIcon = (iconStr) => {
    return iconStr && iconStr !== 'null' && iconStr !== 'undefined' && iconStr.trim() !== '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1">Manage Social Platforms</h2>
          <p className="text-sm text-slate-500">Group and display your links beautifully.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition shadow-lg shadow-accent-500/20">
          <Plus size={16} /> Add Platform
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-dark-700 shadow-xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-dark-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={20} className="text-accent-500" />
              {editing ? 'Edit Platform' : 'New Platform'}
            </h3>
            <button type="button" onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-50 dark:bg-dark-900 rounded-full transition-colors"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Name</label>
              <input type="text" placeholder="e.g. LinkedIn" value={form.platform} 
                onChange={(e) => setForm(f => ({ ...f, platform: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Group</label>
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username / Handle</label>
              <input type="text" placeholder="e.g. @surajprakash" value={form.handle} 
                onChange={(e) => setForm(f => ({ ...f, handle: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile URL</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="url" placeholder="https://..." value={form.url} required
                  onChange={(e) => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ImageIcon size={16} /> Platform Icon (Optional)
              </label>
              <input type="file" accept="image/*,.svg" onChange={(e) => setForm(f => ({ ...f, icon: e.target.files[0] }))}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100 dark:file:bg-accent-900/30 dark:file:text-accent-400" />
              <p className="text-[11px] text-slate-400 mb-0 mt-2 ml-1">Upload a small PNG or SVG icon for this platform.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-dark-700 flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-700 transition">Cancel</button>
            <button type="submit" className="px-8 py-2.5 rounded-xl text-sm bg-accent-500 text-white font-medium hover:bg-accent-600 transition shadow-lg shadow-accent-500/30">
              {editing ? 'Update Platform' : 'Add Platform'}
            </button>
          </div>
        </motion.form>
      )}

      {/* List */}
      <div className="space-y-8 mt-12">
        {loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : socials.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl border border-dashed border-slate-300 dark:border-dark-600">
             <Globe className="mx-auto h-12 w-12 text-slate-400 mb-4" />
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-heading">No platforms added</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Group your links like Professional, Personal, and Community platforms.</p>
          </div>
        ) : (
          CATEGORIES.map(category => {
            const items = socials.filter(s => s.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white font-heading">{category}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-dark-700 text-xs font-bold text-slate-500">{items.length}</span>
                  <div className="h-px bg-slate-200 dark:bg-dark-700 flex-1 ml-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(social => (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={social._id} className="group relative flex items-center p-4 bg-white dark:bg-dark-800 rounded-2xl border border-slate-200 dark:border-dark-700 hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/5 transition-all">
                      
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-100 dark:border-dark-600 flex items-center justify-center shrink-0 overflow-hidden p-2.5 mr-4">
                        <ManageSocialImage social={social} getImageUrl={getImageUrl} isValidIcon={isValidIcon} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {social.platform && <h4 className="font-bold text-slate-900 dark:text-white truncate">{social.platform}</h4>}
                        {social.handle && <p className="text-xs text-slate-500 truncate mt-0.5">{social.handle}</p>}
                        {!social.platform && !social.handle && <span className="text-sm text-slate-400 italic">Icon Only Link</span>}
                      </div>

                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-dark-800/90 backdrop-blur px-1 py-1 rounded-xl shadow-sm border border-slate-100 dark:border-dark-600">
                        <button onClick={() => handleEdit(social)} className="p-1.5 text-slate-400 hover:text-accent-500 hover:bg-slate-50 dark:hover:bg-dark-700 rounded-lg transition"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(social._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-dark-700 rounded-lg transition"><Trash2 size={14} /></button>
                      </div>

                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageSocial;
