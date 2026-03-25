import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Code2 } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/api';

const SKILL_STRUCTURE = {
  "Technical Skills": [
    "Programming Languages", "Frontend Development", "Backend Development",
    "Full Stack Development", "Databases", "Cloud Computing", "DevOps",
    "Version Control", "Deployment & Hosting", "Operating Systems", "Networking",
    "Cybersecurity", "API Development", "Testing & Debugging",
    "Data Structures & Algorithms", "System Design", "Performance Optimization",
    "Development Tools", "Mobile Development", "Machine Learning / AI", "Blockchain"
  ],
  "Core / Soft Skills": [
    "Soft Skills", "Core Strengths", "Cognitive Skills", "Professional Skills"
  ],
  "Tools & Technologies": [
    "Tools & Productivity"
  ],
  "Additional Skills": [
    "Languages", "Interests", "Achievements"
  ]
};

const CATEGORIES = Object.keys(SKILL_STRUCTURE);

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

const ManageSkillImage = ({ skill }) => {
  const [imgError, setImgError] = useState(false);
  const valid = isValidIcon(skill.icon) && !imgError;

  return valid ? (
    <img src={getImageUrl(skill.icon)} alt={skill.name} className="w-full h-full object-contain" onError={() => setImgError(true)} />
  ) : (
    <Code2 size={16} className="text-slate-400" />
  );
};

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Technical Skills',
    group: 'Programming Languages',
    icon: null
  });

  const fetchSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch { setSkills([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const resetForm = () => {
    setForm({ name: '', category: 'Technical Skills', group: 'Programming Languages', icon: null });
    setEditing(null);
    setShowForm(false);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setForm(prev => ({
      ...prev,
      category: newCategory,
      group: SKILL_STRUCTURE[newCategory][0] || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('group', form.group);
      if (form.icon) {
        formData.append('icon', form.icon);
      }

      if (editing) { await updateSkill(editing, formData); }
      else { await createSkill(formData); }
      resetForm(); fetchSkills();
    } catch (err) { alert(err.response?.data?.message || 'Error saving skill'); }
  };

  const handleEdit = (skill) => {
    const cat = skill.category && CATEGORIES.includes(skill.category) ? skill.category : 'Technical Skills';
    const grp = skill.group && SKILL_STRUCTURE[cat].includes(skill.group) ? skill.group : SKILL_STRUCTURE[cat][0];
    setForm({
      name: skill.name,
      category: cat,
      group: grp,
      icon: null
    });
    setEditing(skill._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try { await deleteSkill(id); fetchSkills(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading text-theme-text">Manage Skills</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition shadow-lg shadow-accent-500/20">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
          className="bg-theme-card rounded-xl p-6 border border-theme-border space-y-4 shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-theme-text">{editing ? 'Edit' : 'New'} Skill</h3>
            <button type="button" onClick={resetForm} className="text-theme-muted hover:text-accent-500 transition-colors"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-text mb-1">Skill Name</label>
              <input type="text" placeholder="e.g. React" value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">Category</label>
              <select value={form.category} onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">Group Classification</label>
              <select value={form.group} onChange={(e) => setForm(f => ({ ...f, group: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-500/50">
                {SKILL_STRUCTURE[form.category]?.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-text mb-1">Skill Icon (Optional Upload)</label>
              <input type="file" accept="image/*,.svg" onChange={(e) => setForm(f => ({ ...f, icon: e.target.files[0] }))}
                className="w-full text-sm text-theme-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100 dark:file:bg-accent-900/30 dark:file:text-accent-400" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition shadow-lg shadow-accent-500/20">
              {editing ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-6 mt-8">
        {loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : skills.length === 0 ? (
          <p className="text-center text-theme-muted py-10 bg-theme-bg/50 border border-theme-border shadow-sm rounded-2xl">No skills added yet. Start by adding some skills!</p>
        ) : (
          CATEGORIES.map(category => {
            const categorySkills = skills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className="bg-theme-card rounded-2xl border border-theme-border overflow-hidden">
                <div className="bg-theme-bg/50 px-6 py-3 border-b border-theme-border font-semibold text-theme-text flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-theme-bg border border-theme-border shadow-sm text-theme-muted">{categorySkills.length}</span>
                </div>
                <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categorySkills.map(skill => (
                    <div key={skill._id} className="group flex items-center justify-between bg-theme-bg rounded-xl px-4 py-3 border border-theme-border hover:border-accent-500/50 hover:shadow-theme-glow-sm transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-theme-card border border-theme-border flex items-center justify-center shrink-0 p-2 shadow-sm">
                          <ManageSkillImage skill={skill} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-theme-text text-sm">{skill.name}</h4>
                          <div className="flex gap-2 items-center mt-1">
                            {skill.group && (
                              <span className="text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 px-2 flex py-0.5 rounded-full uppercase tracking-wider font-bold">
                                {skill.group}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(skill)} className="p-1.5 rounded-lg bg-theme-bg hover:text-accent-500 text-theme-muted transition shadow-sm border border-theme-border hover:border-accent-500"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded-lg bg-theme-bg hover:text-red-500 text-theme-muted transition shadow-sm border border-theme-border hover:border-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
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

export default ManageSkills;
