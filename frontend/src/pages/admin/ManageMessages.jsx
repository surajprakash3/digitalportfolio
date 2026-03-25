import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Mail, Calendar, Eye, EyeOff } from 'lucide-react';
import { getContacts, deleteContact } from '../../services/api';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await getContacts();
      setMessages(Array.isArray(data) ? data : []);
    } catch { setMessages([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteContact(id);
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting message');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Messages</h2>

      {messages.length === 0 ? (
        <p className="text-center text-slate-500 py-10">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-5 border border-slate-200 dark:border-dark-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{msg.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="inline-flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> 
                      {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(msg._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>
              {msg.subject && (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Re: {msg.subject}</p>
              )}
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{msg.message}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
