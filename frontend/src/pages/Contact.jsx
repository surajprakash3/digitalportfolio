import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

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

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you'd use axios.post('/api/contact', formData)
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: 'surajprak101@gmail.com',
      link: 'mailto:surajprak101@gmail.com',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      value: '+91 9708519254',
      link: 'tel:+919708519254',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location',
      value: 'Jalandhar, Punjab',
      link: '#',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-theme-text mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <div className="w-20 h-1.5 bg-accent-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-theme-muted max-w-2xl mx-auto text-lg">
            Have a project in mind or just want to say hi? I'd love to hear from you.
            Fill out the form below and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Information */}
          <div className="w-full lg:w-1/3 space-y-8">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.title}
                href={info.link}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start p-6 bg-theme-card/60 backdrop-blur-xl border border-theme-border shadow-theme-glow-sm rounded-2xl group hover:-translate-y-1 hover:shadow-theme-glow transition-all duration-300"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 mr-4 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-theme-glow">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-theme-text mb-1 group-hover:text-accent-500 transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-theme-muted font-medium">
                    {info.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-2/3 bg-theme-card/60 backdrop-blur-xl border border-theme-border shadow-theme-glow-lg p-8 md:p-10 rounded-3xl relative overflow-hidden"
          >
            {/* Background decorative blob */}
            <div className="absolute top-0 right-0 -m-20 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen -z-10"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-theme-text mb-2 tracking-wide">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-theme-bg border border-theme-border focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all duration-200 text-theme-text placeholder-theme-muted shadow-inner"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-theme-text mb-2 tracking-wide">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-theme-bg border border-theme-border focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all duration-200 text-theme-text placeholder-theme-muted shadow-inner"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-theme-text mb-2 tracking-wide">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-theme-bg border border-theme-border focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all duration-200 text-theme-text placeholder-theme-muted shadow-inner"
                  placeholder="How can I help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-theme-text mb-2 tracking-wide">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-theme-bg border border-theme-border focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-theme-text placeholder-theme-muted shadow-inner"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-accent-600 hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 dark:focus:ring-offset-dark-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-accent-500/30 font-heading"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </span>
                )}
              </button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800/30 flex items-center"
                >
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Thank you! Your message has been sent successfully.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30 flex items-center"
                >
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  Oops! Something went wrong. Please try again later.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
