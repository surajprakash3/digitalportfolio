import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      default: '',
      trim: true
    },
    handle: {
      type: String,
      default: '',
      trim: true
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Professional Platforms', 'Coding Platforms', 'Community Platforms', 'Personal Platforms', 'Other'],
      default: 'Professional Platforms'
    },
    icon: {
      type: String,
      default: ''
    },
    iconPublicId: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Social = mongoose.model('Social', socialSchema);
export default Social;
