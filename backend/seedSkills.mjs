import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const skillSchema = new mongoose.Schema({
  name: String,
  level: Number,
  category: String,
  group: String,
  icon: String,
  order: Number,
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

// Delete all existing (broken) skills
await Skill.deleteMany({});
console.log('Cleared old skills.');

// Skills data — name is used by frontend to auto-fetch DevIcon CDN icons
const skills = [
  // Technical Skills - Programming Languages
  { name: 'JavaScript', category: 'Technical Skills', group: 'Programming Languages', order: 1 },
  { name: 'TypeScript', category: 'Technical Skills', group: 'Programming Languages', order: 2 },
  { name: 'Python', category: 'Technical Skills', group: 'Programming Languages', order: 3 },
  { name: 'Java', category: 'Technical Skills', group: 'Programming Languages', order: 4 },
  { name: 'C++', category: 'Technical Skills', group: 'Programming Languages', order: 5 },

  // Technical Skills - Full Stack Development
  { name: 'React', category: 'Technical Skills', group: 'Full Stack Development', order: 1 },
  { name: 'Node.js', category: 'Technical Skills', group: 'Full Stack Development', order: 2 },
  { name: 'Express', category: 'Technical Skills', group: 'Full Stack Development', order: 3 },
  { name: 'Next.js', category: 'Technical Skills', group: 'Full Stack Development', order: 4 },
  { name: 'HTML5', category: 'Technical Skills', group: 'Full Stack Development', order: 5 },
  { name: 'CSS3', category: 'Technical Skills', group: 'Full Stack Development', order: 6 },
  { name: 'Tailwind CSS', category: 'Technical Skills', group: 'Full Stack Development', order: 7 },

  // Technical Skills - DevOps
  { name: 'Docker', category: 'Technical Skills', group: 'DevOps', order: 1 },
  { name: 'Git', category: 'Technical Skills', group: 'DevOps', order: 2 },
  { name: 'GitHub', category: 'Technical Skills', group: 'DevOps', order: 3 },
  { name: 'Linux', category: 'Technical Skills', group: 'DevOps', order: 4 },

  // Technical Skills - Databases
  { name: 'MongoDB', category: 'Technical Skills', group: 'Databases', order: 1 },
  { name: 'MySQL', category: 'Technical Skills', group: 'Databases', order: 2 },

  // Tools & Technologies
  { name: 'VS Code', category: 'Tools & Technologies', group: 'Tools & Productivity', order: 1 },
  { name: 'Postman', category: 'Tools & Technologies', group: 'Tools & Productivity', order: 2 },
  { name: 'Figma', category: 'Tools & Technologies', group: 'Tools & Productivity', order: 3 },
  { name: 'NPM', category: 'Tools & Technologies', group: 'Tools & Productivity', order: 4 },
];

const result = await Skill.insertMany(skills);
console.log(`Seeded ${result.length} skills successfully!`);
result.forEach(s => console.log(`  ✔ ${s.name} (${s.group})`));

await mongoose.disconnect();
