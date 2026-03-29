import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Award, Calendar, Link as LinkIcon, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useCertifications } from '../../hooks/useCertifications';
import { getImageUrl } from '../../utils/imageUtils';
import * as certificationService from '../../services/certificationService';

const ManageCertifications = () => {
  const { data, loading, refetch: fetchCertifications } = useCertifications();
  const certifications = data || [];
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const resetForm = () => {
    setForm({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    });
    setLogoFile(null);
    setLogoPreview('');
    setEditing(null);
    setShowForm(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const parseToInputMonth = (str) => {
    if (!str) return '';
    const months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
    const parts = str.trim().split(' ');
    if (parts.length === 2 && months[parts[0]]) return `${parts[1]}-${months[parts[0]]}`;
    return '';
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const issueDateStr = formatMonthYear(form.issueDate);
    if (!issueDateStr) return alert("Please select an issue date.");
    const expiryDateStr = form.expiryDate ? formatMonthYear(form.expiryDate) : '';

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('issuer', form.issuer);
    formData.append('issueDate', issueDateStr);
    formData.append('expiryDate', expiryDateStr);
    formData.append('credentialId', form.credentialId);
    formData.append('credentialUrl', form.credentialUrl);
    
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      if (editing) {
        await certificationService.updateCertification(editing, formData);
      } else {
        await certificationService.createCertification(formData);
      }
      resetForm();
      fetchCertifications();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving certification');
    }
  };

  const handleEdit = (cert) => {
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: parseToInputMonth(cert.issueDate),
      expiryDate: parseToInputMonth(cert.expiryDate) || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || ''
    });
    setLogoPreview(cert.logo ? getImageUrl(cert.logo) : '');
    setEditing(cert._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await certificationService.deleteCertification(id);
        fetchCertifications();
      } catch (err) {
        alert('Error deleting certification');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Certifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your professional certificates and licenses
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} className="mr-2" />
          Add Certification
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-dark-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 dark:border-dark-700">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-700 flex justify-between items-center bg-slate-50/50 dark:bg-dark-900/50">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                {editing ? 'Edit Certification' : 'Add Certification'}
              </h2>
              <button 
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-dark-700 transition"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Logo Upload */}
                <div className="md:col-span-3 flex flex-col items-center justify-start space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider self-start w-full">Issuer Logo</p>
                  <label className="w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-dark-600 rounded-2xl cursor-pointer hover:border-accent-500 hover:bg-accent-50/50 dark:hover:bg-accent-900/20 transition-all group overflow-hidden relative bg-slate-50 dark:bg-dark-900/50">
                    {logoPreview ? (
                      <img src={logoPreview.startsWith('blob:') ? logoPreview : getImageUrl(logoPreview)} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-slate-400 group-hover:text-accent-500 mb-2 transition-colors" />
                        <span className="text-xs text-slate-500 group-hover:text-accent-600">Upload Image</span>
                      </>
                    )}
                    <input type="file" accept="image/*,.svg" onChange={handleLogoChange} className="hidden" />
                  </label>
                  <p className="text-[10px] text-slate-400 text-center">SVG, PNG, or JPG.<br/>Square ratio recommended.</p>
                </div>

                {/* Main Fields */}
                <div className="md:col-span-9 space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                    <input type="text" placeholder="e.g. AWS Certified Solutions Architect" required value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-accent-500/20 transition" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issuing Organization</label>
                    <input type="text" placeholder="e.g. Amazon Web Services (AWS)" required value={form.issuer}
                      onChange={(e) => setForm(f => ({ ...f, issuer: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-accent-500/20 transition" />
                  </div>

                  {/* Dates Section */}
                  <div className="p-4 bg-slate-50 dark:bg-dark-900/50 rounded-2xl border border-slate-100 dark:border-dark-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Date *</label>
                        <input type="month" value={form.issueDate} required
                          onChange={(e) => setForm(f => ({ ...f, issueDate: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-accent-500/20 transition" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expiration Date</label>
                        <input type="month" value={form.expiryDate}
                          onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-accent-500/20 transition disabled:opacity-50" />
                        <p className="text-[10px] text-slate-400 mt-1">Leave blank if this certification does not expire.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Credential ID</label>
                      <input type="text" placeholder="e.g. 1Q2W3E4R5T" value={form.credentialId}
                        onChange={(e) => setForm(f => ({ ...f, credentialId: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-accent-500/20 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Credential URL</label>
                      <div className="relative">
                        <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="url" placeholder="https://..." value={form.credentialUrl}
                          onChange={(e) => setForm(f => ({ ...f, credentialUrl: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-accent-500/20 transition" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-dark-700 flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700 transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-medium bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30 transition">
                  {editing ? 'Update Certification' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {certifications.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl border border-dashed border-slate-300 dark:border-dark-600">
            <Award className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-heading">No certifications</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Add your professional certifications to build trust and showcase your expertise.
            </p>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center text-accent-500 font-medium hover:text-accent-600">
              <Plus size={20} className="mr-1" /> Add your first certification
            </button>
          </div>
        ) : (
          certifications.map(cert => (
            <motion.div key={cert._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 border border-slate-200/50 dark:border-dark-700/50 hover:shadow-lg hover:border-slate-300 dark:hover:border-dark-600 transition-all flex flex-col sm:flex-row gap-5 items-start">
              
              {/* Logo */}
              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-dark-800 flex items-center justify-center p-2 border border-slate-200 dark:border-dark-700">
                {cert.logo ? (
                  <img src={getImageUrl(cert.logo)} alt={cert.issuer} className="w-full h-full object-contain" />
                ) : (
                  <Award size={24} className="text-slate-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{cert.name}</h3>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{cert.issuer}</p>
                
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1.5" />
                    Issued {cert.issueDate} {cert.expiryDate ? `· Expires ${cert.expiryDate}` : '· No Expiration Date'}
                  </div>
                  {cert.credentialId && (
                    <div className="flex items-center font-mono">
                      ID: {cert.credentialId}
                    </div>
                  )}
                </div>
                
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center text-xs font-bold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors bg-accent-50 dark:bg-accent-900/20 px-3 py-1.5 rounded-lg border border-accent-100 dark:border-accent-900/30 w-fit">
                    Show credential <ExternalLink size={12} className="ml-1.5" />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0 w-full sm:w-auto justify-end mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-dark-800">
                <button onClick={() => handleEdit(cert)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(cert._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition">
                  <Trash2 size={18} />
                </button>
              </div>

            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ManageCertifications;
