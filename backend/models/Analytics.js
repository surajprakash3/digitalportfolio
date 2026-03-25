import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    page: { 
      type: String, 
      required: [true, 'Page path is required'],
      trim: true
    },
    visitorId: { 
      type: String, 
      required: true 
    },
    userAgent: { 
      type: String,
      default: ''
    },
    referrer: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

// Index for efficient querying
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ page: 1, createdAt: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
