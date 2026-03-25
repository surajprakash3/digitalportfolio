import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    hero: {
      fullName: { type: String, default: 'Suraj Prakash' },
      roles: { type: [String], default: ['Full Stack Developer', 'Cloud Engineer'] },
      tagline: { type: String, default: 'Building scalable, modern, and high-performance applications.' },
      shortDescription: { type: String, default: 'I build beautiful, responsive, and performant web applications using modern technologies.' },
      stats: {
        projects: { type: String, default: '10+' },
        experience: { type: String, default: '3+ Years' },
        contributions: { type: String, default: '50+' }
      },
      profileImage: { type: String, default: '' },
      profileImagePublicId: { type: String, default: '' },
      resumeUrl: { type: String, default: '' },
      resumePublicId: { type: String, default: '' },
      availability: { type: Boolean, default: true }
    },
    about: {
      paragraph1: { type: String, default: 'I am a passionate Full Stack Developer and Cloud Enthusiast focused on building scalable and efficient web applications.' },
      paragraph2: { type: String, default: 'I specialize in modern technologies like React, Node.js, and cloud platforms, with a strong emphasis on performance, clean architecture, and user experience.' },
      paragraph3: { type: String, default: 'I continuously improve my skills by building real-world projects, solving complex problems, and staying updated with the latest technologies.' },
      skillsSummary: { type: String, default: 'React, Node.js, MongoDB, modern cloud ecosystems.' },
      focusArea: { type: String, default: 'Full Stack Development & Cloud Engineering' },
      personalStatement: { type: String, default: 'Driven by curiosity, powered by code.' },
      quickInfo: {
        location: { type: String, default: 'Remote / Global' },
        education: { type: String, default: 'B.Tech in Computer Science' },
        experience: { type: String, default: '3+ Years' }
      },
      highlights: { type: [String], default: ['Problem Solving', 'Teamwork', 'Continuous Learning'] }
    },
    socials: {
      githubUrl: { type: String, default: '' },
      linkedinUrl: { type: String, default: '' },
      twitterUrl: { type: String, default: '' },
      email: { type: String, default: 'contact@example.com' }
    }
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
