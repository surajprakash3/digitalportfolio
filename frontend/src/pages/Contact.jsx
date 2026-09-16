import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import * as contactService from '../services/contactService';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactService.sendMessage(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      value: 'surajprak101@gmail.com',
      link: 'mailto:surajprak101@gmail.com',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone',
      value: '+91 9708519254',
      link: 'tel:+919708519254',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Location',
      value: 'Jalandhar, Punjab',
      link: '#',
    },
  ];

  return (
    <>
      <SEO title="Contact" description="Get in touch with Suraj Prakash for projects, collaborations, or questions" url="/contact" />
      <div id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-theme-text mb-2">
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <div className="w-16 h-1.5 bg-accent-500 rounded-full mx-auto mb-3"></div>
            <p className="text-xs sm:text-sm text-theme-muted max-w-lg mx-auto leading-relaxed">
              Have a project in mind, an opportunity to discuss, or just want to connect? Send a message below!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Contact Information Cards */}
            <div className="lg:col-span-5 space-y-3">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center p-3.5 sm:p-4 bg-theme-card/60 backdrop-blur-xl border border-theme-border shadow-sm rounded-xl group hover:border-accent-500/50 hover:shadow-theme-glow transition-all duration-300"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-accent-500/10 text-accent-500 mr-3.5 group-hover:bg-accent-500 group-hover:text-white transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-0.5 group-hover:text-accent-500 transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-theme-text">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}

              <div className="p-4 rounded-xl border border-theme-border/60 bg-theme-bg/50 text-xs text-theme-muted">
                <p className="font-semibold text-theme-text mb-1">Looking for a quick response?</p>
                <p>I typically respond within 24 hours. You can also reach out on LinkedIn or GitHub anytime!</p>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-7 bg-theme-card/60 backdrop-blur-xl border border-theme-border shadow-md p-5 sm:p-7 rounded-2xl relative overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-theme-text mb-1 tracking-wide">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-theme-bg border border-theme-border focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-200 text-xs sm:text-sm text-theme-text placeholder-theme-muted"
                      placeholder="Suraj Prakash"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-theme-text mb-1 tracking-wide">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-theme-bg border border-theme-border focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-200 text-xs sm:text-sm text-theme-text placeholder-theme-muted"
                      placeholder="suraj@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-theme-text mb-1 tracking-wide">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-bg border border-theme-border focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-200 text-xs sm:text-sm text-theme-text placeholder-theme-muted"
                    placeholder="Project Inquiry / Job Opportunity"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-theme-text mb-1 tracking-wide">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-bg border border-theme-border focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-200 resize-none text-xs sm:text-sm text-theme-text placeholder-theme-muted"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-accent-500/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Send Message
                      <Send size={13} />
                    </span>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-2 text-xs"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    Thank you! Your message has been sent successfully.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30 flex items-center gap-2 text-xs"
                  >
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    Oops! Something went wrong. Please try again later.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Contact;
