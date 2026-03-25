import { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { getProfile } from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile for footer:', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <footer id="social" className="bg-theme-bg border-t border-theme-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          {profile?.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-theme-muted hover:text-accent-500 transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" aria-hidden="true" />
            </a>
          )}
          {profile?.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-theme-muted hover:text-accent-500 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" aria-hidden="true" />
            </a>
          )}
          {profile?.twitterUrl && (
            <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-theme-muted hover:text-accent-500 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" aria-hidden="true" />
            </a>
          )}

          <a href={`mailto:${profile?.email || 'contact@example.com'}`} className="text-theme-muted hover:text-accent-500 transition-colors">
            <span className="sr-only">Email</span>
            <Mail className="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-8 text-center text-theme-muted">
          <p className="text-base">
            &copy; {currentYear} {profile?.name || 'Suraj Prakash'}. All rights reserved.
          </p>
          <p className="mt-2 text-sm italic">Built with React, Tailwind CSS, & Framer Motion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
