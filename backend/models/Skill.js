import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    level: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Technical Skills', 'Core / Soft Skills', 'Tools & Technologies', 'Additional Skills']
    },
    group: {
      type: String,
      trim: true
    },
    icon: {
      type: String
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
