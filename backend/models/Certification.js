import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true
    },
    issuer: {
      type: String,
      required: [true, 'Issuer name is required'],
      trim: true
    },
    issueDate: {
      type: String,
      required: [true, 'Issue date is required'],
      trim: true
    },
    expiryDate: {
      type: String,
      trim: true,
      default: '' // Can be empty for certifications that don't expire
    },
    credentialId: {
      type: String,
      trim: true,
      default: ''
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    logoPublicId: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;
