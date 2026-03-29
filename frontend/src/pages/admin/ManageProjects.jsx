import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { getImageUrl } from '../../utils/imageUtils';
import * as projectService from '../../services/projectService';

const ManageProjects = () => {
  const { data, loading, refetch: fetchProjects } = useProjects();
  const projects = data || [];
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', link: '', githubLink: '', techStack: '' });
  const [imagePreview, setImagePreview] = useState('');

  const resetForm = () => {
    setForm({ title: '', description: '', link: '', githubLink: '', techStack: '' });
    setImagePreview('');
    setEditing(null);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('link', form.link);
    if (form.githubLink) formData.append('githubLink', form.githubLink);
    formData.append('technologies', JSON.stringify(form.techStack.split(',').map(t => t.trim()).filter(Boolean)));
    if (form.image) formData.append('image', form.image);

    try {
      if (editing) { await projectService.updateProject(editing, formData); }
      else { await projectService.createProject(formData); }
      resetForm();
      fetchProjects();
    } catch (err) { alert(err.response?.data?.message || 'Error saving project'); }
  };

  const handleEdit = (proj) => {
    setForm({
      title: proj.title,
      description: proj.description,
      link: proj.link || proj.liveLink || '',
      githubLink: proj.githubLink || '',
      techStack: (proj.techStack || proj.technologies || []).join(', '),
    });
    setImagePreview(proj.image ? getImageUrl(proj.image) : '');
    setEditing(proj._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await projectService.deleteProject(id); fetchProjects(); }
    catch (err) { alert(err.response?.data?.message || 'Error deleting project'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading text-theme-text">Manage Projects</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition shadow-lg shadow-accent-500/20">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
          className="bg-theme-card rounded-xl p-6 border border-theme-border space-y-4 shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-theme-text">{editing ? 'Edit' : 'New'} Project</h3>
            <button type="button" onClick={resetForm} className="text-theme-muted hover:text-accent-500 transition-colors"><X size={20} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">Title</label>
                <input type="text" placeholder="Project title" required value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">Description</label>
                <textarea placeholder="Description" required value={form.description} rows={3}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">Project Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-theme-bg border-2 border-theme-border overflow-hidden flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-theme-muted text-[10px] text-center px-1">No Image</div>
                    )}
                  </div>
                  <input type="file" accept="image/*,.svg" onChange={handleImageChange} className="text-xs text-theme-muted flex-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-theme-text mb-1">Live Link</label>
                  <input type="url" placeholder="https://..." required value={form.link}
                    onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">GitHub Repository Link (optional)</label>
              <input type="url" placeholder="https://..." value={form.githubLink}
                onChange={(e) => setForm(f => ({ ...f, githubLink: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">Tech Stack (comma-separated)</label>
              <input type="text" placeholder="React, Tailwind, Node.js" value={form.techStack}
                onChange={(e) => setForm(f => ({ ...f, techStack: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="px-8 py-2.5 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition shadow-lg shadow-accent-500/20">
              {editing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : projects.length === 0 ? (
          <p className="text-center text-theme-muted py-16 bg-theme-bg/50 border border-theme-border rounded-2xl">No projects yet. Showcase your hard work!</p>
        ) : projects.map(proj => (
          <div key={proj._id} className="group flex items-center justify-between bg-theme-card rounded-2xl px-5 py-4 border border-theme-border hover:border-accent-500/50 transition-all hover:shadow-theme-glow-sm">
            <div className="flex items-center gap-4 flex-1 min-w-0">
               <div className="w-16 h-16 rounded-xl bg-theme-bg border border-theme-border overflow-hidden shrink-0 hidden sm:flex items-center justify-center">
                  {proj.image ? (
                    <img src={getImageUrl(proj.image)} alt={proj.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-theme-muted italic text-[10px]">No Cover</div>
                  )}
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-theme-text truncate group-hover:text-accent-500 transition-colors">{proj.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(proj.techStack || proj.technologies || []).slice(0, 4).map(tech => (
                      <span key={tech} className="px-2 py-0.5 text-[10px] font-bold text-theme-text bg-theme-bg/50 border border-theme-border rounded-md">
                        {tech}
                      </span>
                    ))}
                    {(proj.techStack || proj.technologies || []).length > 4 && (
                      <span className="text-[10px] font-bold text-theme-muted flex items-center">
                        +{(proj.techStack || proj.technologies || []).length - 4} more
                      </span>
                    )}
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(proj)} className="p-2 rounded-lg bg-theme-bg hover:text-accent-500 text-theme-muted transition shadow-sm border border-theme-border hover:border-accent-500"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(proj._id)} className="p-2 rounded-lg bg-theme-bg hover:text-red-500 text-theme-muted transition shadow-sm border border-theme-border hover:border-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
