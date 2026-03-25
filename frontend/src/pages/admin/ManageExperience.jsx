import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Calendar, MapPin, Briefcase, GraduationCap, Link, PlusCircle } from 'lucide-react';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../services/api';

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({ 
    type: 'work', 
    company: '', 
    role: '', 
    location: '', 
    locationType: '',
    employmentType: '',
    description: '', 
    startDate: '', 
    endDate: '', 
    current: false,
    skills: '',
    link: '',
    degree: '',
    fieldOfStudy: '',
    grade: '',
    activities: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(Array.isArray(data) ? data : []);
    } catch { setExperiences([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const resetForm = () => { 
    setForm({ 
      type: 'work', company: '', role: '', location: '', locationType: '', 
      employmentType: '', description: '', startDate: '', endDate: '', 
      current: false, skills: '', link: '',
      degree: '', fieldOfStudy: '', grade: '', activities: ''
    }); 
    setLogoFile(null);
    setLogoPreview('');
    setEditing(null); 
    setShowForm(false); 
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const parseToInputMonth = (str) => {
    if (!str || str.toLowerCase() === 'present') return '';
    const months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
    const parts = str.trim().split(' ');
    if (parts.length === 2 && months[parts[0]]) return `${parts[1]}-${months[parts[0]]}`;
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const startStr = formatMonthYear(form.startDate);
    const endStr = form.current ? 'Present' : formatMonthYear(form.endDate);
    
    if (!startStr) return alert("Please select a start date.");
    if (!form.current && !endStr) return alert("Please select an end date or check 'Present'.");

    const durationStr = `${startStr} - ${endStr}`;
    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);

    const formData = new FormData();
    formData.append('type', form.type);
    formData.append('role', form.type === 'education' ? `${form.degree} in ${form.fieldOfStudy}` : form.role);
    formData.append('company', form.company);
    formData.append('duration', durationStr);
    formData.append('location', form.location);
    formData.append('locationType', form.locationType);
    formData.append('employmentType', form.employmentType);
    formData.append('description', form.description);
    formData.append('skills', JSON.stringify(skillsArray));
    formData.append('link', form.link);
    // Education specific fields
    formData.append('degree', form.degree);
    formData.append('fieldOfStudy', form.fieldOfStudy);
    formData.append('grade', form.grade);
    formData.append('activities', form.activities);
    
    if (logoFile) formData.append('logo', logoFile);

    try {
      if (editing) { await updateExperience(editing, formData); }
      else { await createExperience(formData); }
      resetForm(); fetchExperiences();
    } catch (err) { alert(err.response?.data?.message || 'Error saving entry'); }
  };

  const handleEdit = (exp) => {
    const parts = (exp.duration || '').split(' - ');
    const sDate = parts[0] ? parseToInputMonth(parts[0]) : '';
    const eDate = parts[1] && parts[1].toLowerCase() !== 'present' ? parseToInputMonth(parts[1]) : '';
    const isCurrent = parts[1] ? parts[1].toLowerCase() === 'present' : false;

    setForm({ 
      type: exp.type || 'work',
      company: exp.company, 
      role: exp.role || '', 
      location: exp.location || '',
      locationType: exp.locationType || '',
      employmentType: exp.employmentType || '',
      description: exp.description,
      startDate: sDate,
      endDate: eDate,
      current: isCurrent,
      skills: (exp.skills || []).join(', '),
      link: exp.link || '',
      degree: exp.degree || '',
      fieldOfStudy: exp.fieldOfStudy || '',
      grade: exp.grade || '',
      activities: exp.activities || ''
    });
    setLogoPreview(exp.logo || '');
    setEditing(exp._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try { await deleteExperience(id); fetchExperiences(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const onLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading text-theme-text">Experience & Education</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition shadow-lg shadow-accent-500/20">
          <PlusCircle size={18} /> Add Entry
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-theme-card rounded-2xl p-6 border border-theme-border shadow-2xl relative">
          <button onClick={resetForm} className="absolute top-4 right-4 p-2 text-theme-muted hover:text-red-500 transition"><X size={20} /></button>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-theme-text pb-2 border-b border-theme-border">
              {editing ? 'Edit' : 'Add'} {form.type === 'education' ? 'Education' : 'Experience'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Logo Upload Section */}
              <div className="md:col-span-3 flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-2xl bg-theme-bg border-2 border-dashed border-theme-border flex items-center justify-center overflow-hidden group relative">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center p-2">
                       <Plus className="w-8 h-8 text-theme-muted mx-auto" />
                       <span className="text-[10px] text-theme-muted font-medium">Add Logo/Logo</span>
                    </div>
                  )}
                  <input type="file" onChange={onLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.svg" />
                </div>
                <p className="text-[11px] text-slate-500 text-center px-4 leading-tight">Recommended: Square logo with transparent background</p>
              </div>

              {/* Main Fields */}
              <div className="md:col-span-9 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Entry Type</label>
                    <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition">
                      <option value="work">Work Experience</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                  {form.type === 'work' ? (
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Employment Type</label>
                      <select value={form.employmentType} onChange={(e) => setForm(f => ({ ...f, employmentType: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition">
                        <option value="">Select employment type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Apprenticeship">Apprenticeship</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Degree</label>
                      <input type="text" placeholder="e.g. Bachelor's" value={form.degree}
                        onChange={(e) => setForm(f => ({ ...f, degree: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">{form.type === 'education' ? 'School/University' : 'Company'}</label>
                    <input type="text" placeholder={form.type === 'education' ? "e.g. Boston University" : "e.g. Microsoft"} required value={form.company}
                      onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                  </div>
                  {form.type === 'work' ? (
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Title</label>
                      <input type="text" placeholder="e.g. Senior Developer" required={form.type === 'work'} value={form.role}
                        onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Field of Study</label>
                      <input type="text" placeholder="e.g. Business" value={form.fieldOfStudy}
                        onChange={(e) => setForm(f => ({ ...f, fieldOfStudy: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                  )}
                </div>

                {form.type === 'education' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Grade</label>
                      <input type="text" placeholder="e.g. A+" value={form.grade}
                        onChange={(e) => setForm(f => ({ ...f, grade: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                        <input type="text" placeholder="e.g. Boston, MA" value={form.location}
                          onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                      </div>
                    </div>
                  </div>
                )}

                {form.type === 'work' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                        <input type="text" placeholder="e.g. London, UK" value={form.location}
                          onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Location Type</label>
                      <select value={form.locationType} onChange={(e) => setForm(f => ({ ...f, locationType: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition">
                        <option value="">Select location type</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                  </div>
                )}

                {form.type === 'education' && (
                  <div>
                    <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Activities and societies</label>
                    <textarea placeholder="e.g. Alpha Phi Omega, Marching Band, Volleyball" value={form.activities} rows={2}
                      onChange={(e) => setForm(f => ({ ...f, activities: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                    <p className="text-[10px] text-theme-muted mt-1 flex justify-between"><span>Ex: Alpha Phi Omega, Marching Band...</span><span>{form.activities.length}/500</span></p>
                  </div>
                )}

                {/* Dates Section */}
                <div className="p-4 bg-theme-bg/50 rounded-2xl border border-theme-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Calendar size={12} /> Start Date
                      </label>
                      <input type="month" required value={form.startDate}
                        onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
                        className="w-full px-4 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold text-theme-text uppercase tracking-wider mb-2 flex items-center gap-2 ${form.current ? 'opacity-40' : ''}`}>
                        <Calendar size={12} /> End Date
                      </label>
                      <input type="month" required={!form.current} value={form.endDate} disabled={form.current}
                        onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
                        className="w-full px-4 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text disabled:bg-theme-bg/50 focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input type="checkbox" id="currentRole" checked={form.current} 
                      onChange={(e) => setForm(f => ({ ...f, current: e.target.checked, endDate: e.target.checked ? '' : f.endDate }))}
                      className="w-4 h-4 rounded-md accent-accent-500" />
                    <label htmlFor="currentRole" className="text-sm font-semibold text-theme-text cursor-pointer">
                      {form.type === 'education' ? 'I am currently studying here' : 'I currently work in this role'}
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1 flex items-center gap-2">
                      Description
                    </label>
                    <textarea placeholder="List major duties, success stories, and specific projects..." required value={form.description} rows={5}
                      onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition leading-relaxed" />
                    <p className="text-[10px] text-theme-muted mt-1 italic">Write about 20-200 words for a professional look.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">Skills (comma-separated)</label>
                      <input type="text" placeholder="e.g. React, Node.js, Leadership" value={form.skills}
                        onChange={(e) => setForm(f => ({ ...f, skills: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">External Link</label>
                      <div className="relative">
                        <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                        <input type="url" placeholder="https://..." value={form.link}
                          onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:ring-2 focus:ring-accent-500/20 transition" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-red-500 transition">Cancel</button>
                  <button type="submit" className="px-10 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold hover:shadow-xl hover:shadow-accent-500/30 transition-all">
                    {editing ? 'Update Entry' : 'Add to Timeline'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Entries Display */}
      <div className="space-y-4 pt-4">
        {loading ? (
          <div className="text-center py-20"><div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16 bg-theme-bg/50 rounded-2xl border-2 border-dashed border-theme-border">
            <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-theme-muted font-medium">No experience or education listed yet.</p>
          </div>
        ) : experiences.map(exp => (
          <div key={exp._id} className="group relative flex items-start gap-4 bg-theme-card rounded-2xl p-5 border border-theme-border hover:shadow-xl hover:border-accent-500 transition-all">
             <div className="w-14 h-14 rounded-xl bg-theme-bg p-2 border border-theme-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                {exp.logo ? (
                  <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                ) : (
                  exp.type === 'education' ? <GraduationCap size={24} className="text-theme-muted" /> : <Briefcase size={24} className="text-theme-muted" />
                )}
             </div>

             <div className="flex-1 min-w-0 pr-12">
               <div className="flex items-center gap-2 mb-1">
                 <h4 className="font-bold text-theme-text leading-tight">{exp.role}</h4>
                 <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${exp.type === 'education' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                   {exp.type}
                 </span>
               </div>
               <p className="text-sm font-semibold text-theme-text flex items-center gap-1.5 flex-wrap">
                 {exp.company}
                 {exp.employmentType && <span className="text-theme-muted font-normal">· {exp.employmentType}</span>}
               </p>
               <p className="text-xs text-theme-muted mt-1 flex items-center gap-1.5">
                  <Calendar size={12} /> {exp.duration}
                  {exp.location && <span>· {exp.location} ({exp.locationType || 'On-site'})</span>}
               </p>

               {exp.skills?.length > 0 && (
                 <div className="flex flex-wrap gap-1 mt-3">
                    {exp.skills.slice(0, 5).map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-theme-bg text-theme-muted rounded-md font-medium border border-theme-border">
                        {s}
                      </span>
                    ))}
                    {exp.skills.length > 5 && <span className="text-[10px] text-theme-muted">+{exp.skills.length - 5} more</span>}
                 </div>
               )}
             </div>

             <div className="absolute top-4 right-4 flex items-center gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
               <button onClick={() => handleEdit(exp)} className="p-2 rounded-xl bg-theme-bg text-theme-muted hover:text-accent-500 transition shadow-sm border border-theme-border hover:border-accent-500"><Pencil size={15} /></button>
               <button onClick={() => handleDelete(exp._id)} className="p-2 rounded-xl bg-theme-bg text-theme-muted hover:text-red-500 transition shadow-sm border border-theme-border hover:border-red-500"><Trash2 size={15} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageExperience;
