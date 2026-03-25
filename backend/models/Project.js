import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Project title is required'],
      trim: true
    },
    description: { 
      type: String, 
      required: [true, 'Project description is required'],
      minlength: [10, 'Description should be at least 10 characters long']
    },
    image: { 
      type: String, 
    },
    link: { 
      type: String, 
      required: [true, 'Project link is required'],
      match: [/^https?:\/\/.+/, 'Please provide a valid URL']
    },
    githubLink: { 
      type: String, 
      match: [/^https?:\/\/.+/, 'Please provide a valid URL']
    },
    techStack: [{ 
      type: String,
      required: [true, 'At least one technology is required in the tech stack'] 
    }],
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
