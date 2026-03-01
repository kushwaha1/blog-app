const Blog = require('../models/Blog');

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (err) {
    console.error('Error in getAllBlogs:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'email profileImage')
      .populate('comments.user', 'email profileImage')
      .populate('comments.replies.user', 'email profileImage');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    res.status(200).json({ blog });
  } catch (err) {
    console.error('Error in getSingleBlog:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const blog = await Blog.create({
      title,
      description,
      image: req.file ? req.file.path : '',
      author: req.user.id,
    });

    res.status(201).json({ blog });
  } catch (err) {
    console.error('Error in createBlog:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const blog = await Blog.findOne({ _id: req.params.id, author: req.user.id });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized.' });
    }

    blog.title = title;
    blog.description = description;
    if (req.file) blog.image = req.file.path;

    await blog.save();

    res.status(200).json({ blog });
  } catch (err) {
    console.error('Error in updateBlog:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user.id });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('Error in deleteBlog:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getAllBlogs, getSingleBlog, createBlog, updateBlog, deleteBlog };