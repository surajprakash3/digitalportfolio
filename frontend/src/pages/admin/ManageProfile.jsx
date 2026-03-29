import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Upload, User, Briefcase, MapPin, Globe, Github, Linkedin, Twitter, Mail, Wand2, Plus, Minus, ArrowRight, Download, Eye, Layout, FileText, SplitSquareHorizontal, ShieldAlert, Sparkles, Navigation, CheckCircle } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { getImageUrl } from '../../utils/imageUtils';
import * as profileService from '../../services/profileService';
import * as resumeService from '../../services/resumeService';

class ManageProfileErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("ManageProfile Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-50 text-red-900 border border-red-200 rounded-xl m-10">
          <h2 className="text-2xl font-bold mb-4">Admin Profile Crashed</h2>
          <pre className="whitespace-pre-wrap text-sm">{this.state.error?.toString()}</pre>
          <pre className="whitespace-pre-wrap text-sm mt-4">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ManageProfileInner = () => {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' or 'about'
  const [previewMode, setPreviewMode] = useState('hero'); // 'hero' or 'about'
  
  const [heroForm, setHeroForm] = useState({
    fullName: '',
    roles: [],
    tagline: '',
    shortDescription: '',
    stats: { projects: '', experience: '', contributions: '' },
    availability: true
  });

  const [aboutForm, setAboutForm] = useState({
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    skillsSummary: '',
    focusArea: '',
    personalStatement: '',
    quickInfo: { location: '', education: '', experience: '' },
    highlights: []
  });

  const [socialsForm, setSocialsForm] = useState({
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    email: ''
  });

  // Media
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState('');

  const { data: profile, loading, refetch: fetchProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      if (profile.hero) {
        setHeroForm({
          fullName: profile.hero.fullName || '',
          roles: profile.hero.roles?.length ? profile.hero.roles : ['Full Stack Developer'],
          tagline: profile.hero.tagline || '',
          shortDescription: profile.hero.shortDescription || '',
          stats: profile.hero.stats || { projects: '10+', experience: '3+ Years', contributions: '50+' },
          availability: profile.hero.availability !== false
        });
        if (profile.hero.profileImage) {
          setImagePreview(getImageUrl(profile.hero.profileImage));
        }
      }

      if (profile.about) {
        setAboutForm({
          paragraph1: profile.about.paragraph1 || '',
          paragraph2: profile.about.paragraph2 || '',
          paragraph3: profile.about.paragraph3 || '',
          skillsSummary: profile.about.skillsSummary || '',
          focusArea: profile.about.focusArea || '',
          personalStatement: profile.about.personalStatement || '',
          quickInfo: profile.about.quickInfo || { location: '', education: '', experience: '' },
          highlights: profile.about.highlights?.length ? profile.about.highlights : ['Problem Solving']
        });
      }

      if (profile.socials) {
        setSocialsForm({
          githubUrl: profile.socials.githubUrl || '',
          linkedinUrl: profile.socials.linkedinUrl || '',
          twitterUrl: profile.socials.twitterUrl || '',
          email: profile.socials.email || ''
        });
      }
    }
  }, [profile]);

  const handleHeroChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('stat_')) {
      const statName = name.replace('stat_', '');
      setHeroForm(prev => ({ ...prev, stats: { ...prev.stats, [statName]: value } }));
    } else {
      setHeroForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleRoleChange = (index, value) => {
    const newRoles = [...heroForm.roles];
    newRoles[index] = value;
    setHeroForm(prev => ({ ...prev, roles: newRoles }));
  };

  const addRole = () => setHeroForm(prev => ({ ...prev, roles: [...prev.roles, ''] }));
  const removeRole = (index) => setHeroForm(prev => ({ ...prev, roles: prev.roles.filter((_, i) => i !== index) }));

  const handleHighlightChange = (index, value) => {
    const newHL = [...aboutForm.highlights];
    newHL[index] = value;
    setAboutForm(prev => ({ ...prev, highlights: newHL }));
  };

  const addHighlight = () => setAboutForm(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  const removeHighlight = (index) => setAboutForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('quick_')) {
      const qn = name.replace('quick_', '');
      setAboutForm(prev => ({ ...prev, quickInfo: { ...prev.quickInfo, [qn]: value } }));
    } else {
      setAboutForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialsChange = (e) => {
    const { name, value } = e.target;
    setSocialsForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeName(file.name);
    }
  };

  const handleAutoGenerateHero = () => {
    setHeroForm(prev => ({
      ...prev,
      tagline: prev.tagline || "Building scalable, modern, and high-performance applications.",
      shortDescription: prev.shortDescription || "I build beautiful, responsive, and performant web applications using modern technologies.",
    }));
  };

  const handleAutoGenerateAbout = () => {
    setAboutForm(prev => ({
      ...prev,
      paragraph1: prev.paragraph1 || "I am a passionate Full Stack Developer and Cloud Enthusiast focused on building scalable and efficient web applications.",
      paragraph2: prev.paragraph2 || "I specialize in modern technologies like React, Node.js, and cloud platforms, with a strong emphasis on performance, clean architecture, and user experience.",
      paragraph3: prev.paragraph3 || "I continuously improve my skills by building real-world projects, solving complex problems, and staying updated with the latest technologies.",
      skillsSummary: prev.skillsSummary || "React, Node.js, MongoDB, AWS, Docker",
      focusArea: prev.focusArea || "Full Stack Development & Cloud Engineering",
      personalStatement: prev.personalStatement || "Driven by curiosity, powered by code."
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      if (resumeFile) {
        const resumeFormData = new FormData();
        resumeFormData.append('resume', resumeFile);
        await resumeService.uploadResume(resumeFormData);
      }

      const formData = new FormData();
      
      // Send as isolated stringified objects
      formData.append('hero', JSON.stringify({
          ...heroForm,
          roles: heroForm.roles.filter(r => r.trim() !== '')
      }));

      formData.append('about', JSON.stringify({
          ...aboutForm,
          highlights: aboutForm.highlights.filter(h => h.trim() !== '')
      }));

      formData.append('socials', JSON.stringify(socialsForm));

      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      await profileService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 pb-4 border-b border-theme-border gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Portfolio Architecture</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Separated controls for your Home banner and About section.</p>
        </div>
        
        <div className="flex items-center gap-4">
            {success && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg text-sm">
                ✓ {success}
            </span>
            )}
            <button
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-accent-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
            {saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Saving...</>
            ) : (
                <><Save size={18} className="mr-2" /> Save Architecture</>
            )}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Editor */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* Form Toggle Tabs */}
            <div className="flex bg-slate-100 dark:bg-dark-700/50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => { setActiveTab('hero'); setPreviewMode('hero'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'hero' ? 'bg-white dark:bg-dark-600 text-accent-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer'}`}
                >
                  <Layout size={18} /> Hero Section Data
                </button>
                <button 
                  onClick={() => { setActiveTab('about'); setPreviewMode('about'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'about' ? 'bg-white dark:bg-dark-600 text-accent-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer'}`}
                >
                  <FileText size={18} /> About Page Data
                </button>
            </div>

            {/* --- HERO FORM --- */}
            <AnimatePresence mode="wait">
            {activeTab === 'hero' && (
              <motion.div key="hero" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                    <Navigation size={14} /> Applies strictly to Home Page Banner
                  </div>
                  <button onClick={handleAutoGenerateHero} className="text-xs font-bold text-accent-500 flex items-center gap-1 hover:underline cursor-pointer"><Wand2 size={14}/> Auto-Fill Text</button>
                </div>

                <div className="glass rounded-2xl p-6 border border-theme-border/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <User size={20} className="text-accent-500" /> Identity
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                        <input type="text" name="fullName" value={heroForm.fullName} onChange={handleHeroChange} className={inputClass} placeholder="John Doe" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Animated Roles (Typing Effect)</label>
                        <div className="space-y-3">
                            {heroForm.roles.map((role, idx) => (
                                <div key={`role-${idx}`} className="flex items-center gap-2">
                                    <input type="text" value={role} onChange={(e) => handleRoleChange(idx, e.target.value)} className={inputClass} placeholder="e.g. Cloud Engineer" />
                                    {heroForm.roles.length > 1 && (
                                        <button type="button" onClick={() => removeRole(idx)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors cursor-pointer">
                                            <Minus size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addRole} className="flex items-center gap-1 text-sm text-accent-600 dark:text-accent-400 font-bold hover:underline mt-2 cursor-pointer">
                                <Plus size={16} /> Add Role
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-theme-border/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <SplitSquareHorizontal size={20} className="text-accent-500" /> Hero Content
                    </h2>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tagline (Main Headline)</label>
                        <input type="text" name="tagline" value={heroForm.tagline} onChange={handleHeroChange} className={inputClass} placeholder="Driven by curiosity..." />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
                        <textarea name="shortDescription" value={heroForm.shortDescription} onChange={handleHeroChange} rows={2} className={inputClass} placeholder="I build resilient systems..." />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 bg-accent-50 dark:bg-accent-900/10 p-4 rounded-xl border border-accent-100 dark:border-accent-900/30">
                        <input type="checkbox" name="availability" checked={heroForm.availability} onChange={handleHeroChange} id="available" className="w-5 h-5 accent-accent-500 rounded cursor-pointer" />
                        <div>
                            <label htmlFor="available" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer block">Availability / Open to Work Badge</label>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-theme-border/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-accent-500" /> Hero Stats Row
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Projects</label>
                            <input type="text" name="stat_projects" value={heroForm.stats.projects} onChange={handleHeroChange} className={inputClass} placeholder="10+" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience</label>
                            <input type="text" name="stat_experience" value={heroForm.stats.experience} onChange={handleHeroChange} className={inputClass} placeholder="3+ Yrs" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contributions</label>
                            <input type="text" name="stat_contributions" value={heroForm.stats.contributions} onChange={handleHeroChange} className={inputClass} placeholder="50+" />
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="glass rounded-2xl p-6 border border-theme-border/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Upload size={20} className="text-accent-500" /> Media Attachments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hero Profile Blob Image</label>
                            <div className="flex flex-col gap-4">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 dark:bg-dark-700 border-2 border-theme-border flex-shrink-0">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={30} /></div>
                                )}
                                </div>
                                <input type="file" accept="image/*,.svg" onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100 dark:file:bg-accent-900/30 dark:file:text-accent-300 cursor-pointer" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resume Document</label>
                            <div className="p-6 border-2 border-dashed border-theme-border rounded-2xl flex flex-col items-center justify-center text-center bg-theme-bg/50 hover:bg-theme-bg transition-colors">
                                <Upload size={24} className="text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{resumeName ? resumeName : 'Upload PDF/DOC'}</p>
                                <label className="cursor-pointer">
                                    <span className="px-4 py-2 bg-slate-100 dark:bg-dark-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors">Browse Files</span>
                                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange}/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

              </motion.div>
            )}

            {/* --- ABOUT FORM --- */}
            {activeTab === 'about' && (
              <motion.div key="about" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <ShieldAlert size={14} /> Applies strictly to About Page View
                  </div>
                  <button onClick={handleAutoGenerateAbout} className="text-xs font-bold text-accent-500 flex items-center gap-1 hover:underline cursor-pointer"><Wand2 size={14}/> Auto-Fill Pro Text</button>
                </div>

                <div className="glass rounded-2xl p-6 border border-theme-border/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-accent-500" /> Story & Biography
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paragraph 1 (Intro)</label>
                            <textarea name="paragraph1" value={aboutForm.paragraph1} onChange={handleAboutChange} rows={2} className={inputClass} placeholder="I am a passionate..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paragraph 2 (Specialties)</label>
                            <textarea name="paragraph2" value={aboutForm.paragraph2} onChange={handleAboutChange} rows={2} className={inputClass} placeholder="I specialize in..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paragraph 3 (Continued Growth)</label>
                            <textarea name="paragraph3" value={aboutForm.paragraph3} onChange={handleAboutChange} rows={2} className={inputClass} placeholder="I continuously improve..." />
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-theme-border/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-accent-500" /> Emphasized Blocks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Focus Area</label>
                            <input type="text" name="focusArea" value={aboutForm.focusArea} onChange={handleAboutChange} className={inputClass} placeholder="Full Stack Cloud" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Personal Statement</label>
                            <input type="text" name="personalStatement" value={aboutForm.personalStatement} onChange={handleAboutChange} className={inputClass} placeholder="Driven by curiosity." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills Summary</label>
                            <input type="text" name="skillsSummary" value={aboutForm.skillsSummary} onChange={handleAboutChange} className={inputClass} placeholder="React, Node, etc." />
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-theme-border/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-accent-500" /> Quick Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                            <input type="text" name="quick_location" value={aboutForm.quickInfo.location} onChange={handleAboutChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Education</label>
                            <input type="text" name="quick_education" value={aboutForm.quickInfo.education} onChange={handleAboutChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience Info</label>
                            <input type="text" name="quick_experience" value={aboutForm.quickInfo.experience} onChange={handleAboutChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-theme-border/50 mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Personality Traits / Highlights</label>
                    <div className="space-y-3">
                        {aboutForm.highlights.map((hl, idx) => (
                            <div key={`hl-${idx}`} className="flex items-center gap-2">
                                <input type="text" value={hl} onChange={(e) => handleHighlightChange(idx, e.target.value)} className={inputClass} placeholder="e.g. Problem Solving" />
                                {aboutForm.highlights.length > 1 && (
                                    <button type="button" onClick={() => removeHighlight(idx)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl cursor-pointer"><Minus size={18} /></button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addHighlight} className="flex items-center gap-1 text-sm text-accent-600 hover:underline mt-2 cursor-pointer border-none bg-transparent"><Plus size={16}/> Add Highlight</button>
                    </div>
                </div>

              </motion.div>
            )}
            </AnimatePresence>

            {/* --- GLOBAL SOCIALS (Applies to Both) --- */}
            <div className="glass rounded-2xl p-6 border border-theme-border/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe size={20} className="text-accent-500" /> Global Integration (Socials)
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Linkedin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input type="url" name="linkedinUrl" value={socialsForm.linkedinUrl} onChange={handleSocialsChange} className={`${inputClass} pl-11`} placeholder="LinkedIn URL" />
                    </div>
                    <div className="relative">
                        <Github className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input type="url" name="githubUrl" value={socialsForm.githubUrl} onChange={handleSocialsChange} className={`${inputClass} pl-11`} placeholder="GitHub URL" />
                    </div>
                    <div className="relative">
                        <Twitter className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input type="url" name="twitterUrl" value={socialsForm.twitterUrl} onChange={handleSocialsChange} className={`${inputClass} pl-11`} placeholder="Twitter URL" />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input type="email" name="email" value={socialsForm.email} onChange={handleSocialsChange} className={`${inputClass} pl-11`} placeholder="Email Address" />
                    </div>
                </div>
            </div>

        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-5 relative hidden lg:block">
            <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Eye size={16} /> Live Preview</h3>
                    
                    <div className="flex bg-slate-100 dark:bg-dark-700/50 p-1 rounded-lg">
                        <button onClick={() => setPreviewMode('hero')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${previewMode === 'hero' ? 'bg-white dark:bg-dark-600 text-accent-500 shadow-sm' : 'text-slate-500'}`}>Hero</button>
                        <button onClick={() => setPreviewMode('about')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${previewMode === 'about' ? 'bg-white dark:bg-dark-600 text-accent-500 shadow-sm' : 'text-slate-500'}`}>About</button>
                    </div>
                </div>
                
                <div className="glass rounded-[2rem] overflow-hidden border border-theme-border shadow-2xl scale-[0.85] transform origin-top w-[115%]">
                    <AnimatePresence mode="wait">
                        {previewMode === 'hero' ? (
                            <motion.div key="pv-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-theme-bg relative p-8 min-h-[600px] flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                                {heroForm.availability && (
                                    <div className="mb-4 inline-flex items-center space-x-2 bg-accent-500/10 text-accent-500 px-3 py-1.5 rounded-full border border-accent-500/30 w-max">
                                        <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                                        </span>
                                        <span className="text-[10px] font-bold tracking-wide uppercase">Open to new opportunities</span>
                                    </div>
                                )}

                                <h1 className="text-4xl font-extrabold font-heading mb-2">
                                    Hi, I'm <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-blue-500">{heroForm.fullName || 'Your Name'}</span>
                                </h1>
                                <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-4">
                                    I am a <span className="text-theme-text">{heroForm.roles[0] || 'Developer'}</span>...
                                </h2>
                                
                                <p className="text-sm font-bold text-theme-text mb-2 leading-relaxed max-w-sm">{heroForm.tagline || 'Tagline here.'}</p>
                                <p className="text-xs text-theme-muted mb-6 leading-relaxed max-w-sm">{heroForm.shortDescription || 'Short description goes here...'}</p>

                                <div className="flex gap-4 mb-6 border-y border-theme-border/50 py-3">
                                    <div>
                                        <div className="text-lg font-black text-theme-text">{heroForm.stats.projects || '0'}</div>
                                        <div className="text-[10px] font-bold text-theme-muted uppercase">Projects</div>
                                    </div>
                                    <div className="w-px h-8 bg-theme-border/50"></div>
                                    <div>
                                        <div className="text-lg font-black text-theme-text">{heroForm.stats.experience || '0'}</div>
                                        <div className="text-[10px] font-bold text-theme-muted uppercase">Experience</div>
                                    </div>
                                    <div className="w-px h-8 bg-theme-border/50"></div>
                                    <div>
                                        <div className="text-lg font-black text-theme-text">{heroForm.stats.contributions || '0'}</div>
                                        <div className="text-[10px] font-bold text-theme-muted uppercase">Commits</div>
                                    </div>
                                </div>

                                <div className="flex gap-3 relative z-10">
                                    <div className="px-5 py-2.5 bg-accent-500 text-white text-xs font-bold rounded-xl flex items-center">View My Work <ArrowRight size={14} className="ml-1" /></div>
                                    <div className="px-5 py-2.5 bg-theme-card border border-theme-border text-xs font-bold rounded-xl flex items-center"><Download size={14} className="mr-1" /> CV</div>
                                </div>

                                <div className="absolute right-6 bottom-16 w-32 h-40 rounded-2xl bg-slate-200 dark:bg-dark-700 overflow-hidden shadow-2xl border-2 border-theme-bg rotate-3 z-0">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-theme-card">Image</div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="pv-about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-theme-bg relative p-8 min-h-[600px]">
                                <h2 className="text-2xl font-bold font-heading mb-6 border-b border-theme-border pb-2">About <span className="text-accent-500">Me</span></h2>
                                
                                <div className="space-y-4 text-xs text-theme-muted leading-relaxed">
                                    <p>{aboutForm.paragraph1 || 'Intro paragraph...'}</p>
                                    <p>{aboutForm.paragraph2 || 'Specialties...'}</p>
                                    <p>{aboutForm.paragraph3 || 'Goals...'}</p>
                                </div>

                                <div className="mt-6 p-4 rounded-xl bg-theme-card border border-theme-border">
                                    <h3 className="text-xs font-bold text-theme-text uppercase mb-2">My Focus</h3>
                                    <p className="text-sm font-bold text-accent-500">{aboutForm.focusArea || 'Your focus area'}</p>
                                    
                                    <h3 className="text-xs font-bold text-theme-text uppercase mt-4 mb-2">Technologies</h3>
                                    <p className="text-xs italic">{aboutForm.skillsSummary || 'Summary of tools'}</p>
                                </div>

                                <div className="mt-4 flex gap-2 flex-wrap">
                                    {aboutForm.highlights.map((hl, i) => (
                                        <span key={i} className="px-2 py-1 bg-accent-500/10 text-accent-500 text-[10px] font-bold rounded-md border border-accent-500/20">{hl || 'Highlight'}</span>
                                    ))}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-theme-border bg-theme-card/50 backdrop-blur flex justify-between text-[10px] font-bold">
                                    <span><MapPin size={12} className="inline mr-1 text-accent-500" />{aboutForm.quickInfo.location || 'Location'}</span>
                                    <span>{aboutForm.quickInfo.experience || 'Experience'} Exp</span>
                                    <span>{aboutForm.quickInfo.education || 'Education'}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const ManageProfile = () => (
    <ManageProfileErrorBoundary>
        <ManageProfileInner />
    </ManageProfileErrorBoundary>
);

export default ManageProfile;
