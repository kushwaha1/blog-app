const Blog = require('../models/Blog');

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    blog.comments.push({ user: req.user.id, text: text.trim() });
    await blog.save();

    const updated = await Blog.findById(req.params.blogId)
      .populate('comments.user', 'email profileImage')
      .populate('comments.replies.user', 'email profileImage');

    res.status(201).json({ comments: updated.comments });
  } catch (err) {
    console.error('Error in addComment:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const addReply = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Reply cannot be empty.' });
    }

    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    comment.replies.push({ user: req.user.id, text: text.trim() });
    await blog.save();

    const updated = await Blog.findById(req.params.blogId)
      .populate('comments.user', 'email profileImage')
      .populate('comments.replies.user', 'email profileImage');

    res.status(201).json({ comments: updated.comments });
  } catch (err) {
    console.error('Error in addReply:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { addComment, addReply };