import asyncHandler from 'express-async-handler';
import BlogPost from '../models/BlogPost.js';

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

// @desc    Get all published blog posts
// @route   GET /api/blog
// @access  Public
const getPublishedPosts = asyncHandler(async (req, res) => {
  const { tag, search, page = 1, limit = 10 } = req.query;
  const filter = { published: true };

  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await BlogPost.countDocuments(filter);
  const posts = await BlogPost.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select('-content');

  res.json({
    posts,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get a single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, published: true });

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  res.json(post);
});

// @desc    Get all blog posts (including drafts)
// @route   GET /api/blog/admin/all
// @access  Private/Admin
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({}).sort({ createdAt: -1 });
  res.json(posts);
});

// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private/Admin
const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, tags, published } = req.body;

  const post = new BlogPost({
    title,
    content,
    excerpt,
    tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
    published: published === 'true' || published === true,
    author: req.user.name || 'Admin',
  });

  if (req.file) {
    post.coverImage = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    post.coverImagePublicId = req.file.filename;
  }

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
const updatePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const { title, content, excerpt, tags, published, slug } = req.body;

  post.title = title || post.title;
  post.content = content || post.content;
  post.excerpt = excerpt || post.excerpt;
  post.slug = slug || post.slug;
  post.tags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : post.tags;
  post.published = published !== undefined ? (published === 'true' || published === true) : post.published;

  if (req.file) {
    if (isCloudinaryConfigured && post.coverImagePublicId) {
      try {
        const { cloudinary } = await import('../config/cloudinary.js');
        await cloudinary.uploader.destroy(post.coverImagePublicId);
      } catch { /* ignore */ }
    }
    post.coverImage = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    post.coverImagePublicId = req.file.filename;
  }

  const updatedPost = await post.save();
  res.json(updatedPost);
});

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
const deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (isCloudinaryConfigured && post.coverImagePublicId) {
    try {
      const { cloudinary } = await import('../config/cloudinary.js');
      await cloudinary.uploader.destroy(post.coverImagePublicId);
    } catch { /* ignore */ }
  }

  await BlogPost.deleteOne({ _id: req.params.id });
  res.json({ message: 'Blog post removed' });
});

export { getPublishedPosts, getPostBySlug, getAllPosts, createPost, updatePost, deletePost };
