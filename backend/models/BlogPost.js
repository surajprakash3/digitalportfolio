import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Blog title is required'],
      trim: true
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    content: { 
      type: String, 
      required: [true, 'Blog content is required'] 
    },
    excerpt: { 
      type: String, 
      required: [true, 'Blog excerpt is required'],
      maxlength: [300, 'Excerpt must be under 300 characters']
    },
    coverImage: {
      type: String,
      default: ''
    },
    coverImagePublicId: {
      type: String,
      default: ''
    },
    tags: [{ 
      type: String, 
      trim: true 
    }],
    published: { 
      type: Boolean, 
      default: false 
    },
    author: { 
      type: String, 
      default: 'Admin' 
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title before validation
blogPostSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ published: 1, createdAt: -1 });
blogPostSchema.index({ tags: 1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
