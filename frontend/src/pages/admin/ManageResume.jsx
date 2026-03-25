import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { uploadResume, getResumeStatus } from '../../services/api';
import { useEffect } from 'react';

const ManageResume = () => {
  const [status, setStatus] = useState({ available: false, filename: null });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await getResumeStatus();
        setStatus(data);
      } catch {}
    };
    checkStatus();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const data = await uploadResume(formData);
      setMessage({ type: 'success', text: data.message });
      setStatus({ available: true, filename: data.filename });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Resume Management</h2>

      <div className="bg-white dark:bg-dark-800 rounded-xl p-8 border border-slate-200 dark:border-dark-700 max-w-lg">
        {/* Current status */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Resume</h3>
          {status.available ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check size={16} />
              <span className="text-sm">{status.filename || 'Resume uploaded'}</span>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No resume uploaded yet</p>
          )}
        </div>

        {/* Upload */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-accent-500 hover:bg-accent-50/50 dark:hover:bg-accent-900/10 transition-all"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Click to upload resume
              </p>
              <p className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX (max 10MB)</p>
            </>
          )}
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManageResume;
