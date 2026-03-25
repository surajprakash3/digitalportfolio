import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/api';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', link: '', githubLink: '', techStack: '' });

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch { setProjects([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', link: '', githubLink: '', techStack: '' });
    setEditing(null);
    setShowForm(false);
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
      if (editing) { await updateProject(editing, formData); }
      else { await createProject(formData); }
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
    setEditing(proj._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await deleteProject(id); fetchProjects(); }
    catch (err) { alert(err.response?.data?.message || 'Error deleting project'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading text-theme-text">Manage Projects</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
          className="bg-theme-card rounded-xl p-6 border border-theme-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-theme-text">{editing ? 'Edit' : 'New'} Project</h3>
            <button type="button" onClick={resetForm} className="text-theme-muted hover:text-accent-500"><X size={20} /></button>
          </div>
          <input type="text" placeholder="Project title" required value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
          <textarea placeholder="Description" required value={form.description} rows={3}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
          <input type="url" placeholder="Live link (https://...)" required value={form.link}
            onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
          <input type="url" placeholder="GitHub Repository link (optional)" value={form.githubLink}
            onChange={(e) => setForm(f => ({ ...f, githubLink: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
          <input type="text" placeholder="Tech stack (comma-separated)" value={form.techStack}
            onChange={(e) => setForm(f => ({ ...f, techStack: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
          <input type="file" accept="image/*,.svg" onChange={(e) => setForm(f => ({ ...f, image: e.target.files[0] }))} className="text-sm text-theme-muted" />
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition">
            {editing ? 'Update' : 'Create'}
          </button>
        </motion.form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : projects.length === 0 ? (
          <p className="text-center text-theme-muted py-10">No projects yet.</p>
        ) : projects.map(proj => (
          <div key={proj._id} className="flex items-center justify-between bg-theme-card rounded-xl px-5 py-4 border border-theme-border">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-theme-text truncate">{proj.title}</h4>
              <div className="flex flex-wrap gap-2 mt-3">
                {(proj.techStack || proj.technologies || []).map(tech => (
                  <span key={tech} className="px-3 py-1 text-[11px] font-bold text-theme-text bg-theme-bg border border-theme-border rounded-lg shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => handleEdit(proj)} className="p-2 rounded-lg hover:bg-theme-border/50 text-theme-muted transition"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(proj._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
