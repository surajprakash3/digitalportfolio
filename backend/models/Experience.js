import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['work', 'education'],
      default: 'work',
      required: true
    },
    company: { 
      type: String, 
      required: [true, 'Company/Institution name is required'],
      trim: true
    },
    role: { 
      type: String, 
      required: [true, 'Role/Degree title is required'],
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Self-employed', 'Freelance', 'Contract', 'Internship', 'Apprenticeship', ''],
      default: ''
    },
    duration: { 
      type: String, 
      required: [true, 'Duration is required (e.g., Jan 2020 - Present)'],
      trim: true
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    locationType: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote', ''],
      default: ''
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'],
      minlength: [10, 'Description should be at least 10 characters long']
    },
    // Education Specific
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    grade: { type: String, default: '' },
    activities: { type: String, default: '' },
    
    skills: [String],
    logo: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
