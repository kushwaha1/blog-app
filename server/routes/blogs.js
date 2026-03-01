const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', isAuthenticated, getAllBlogs);
router.get('/:id', isAuthenticated, getSingleBlog);
router.post('/', isAuthenticated, upload.single('image'), createBlog);
router.put('/:id', isAuthenticated, upload.single('image'), updateBlog);
router.delete('/:id', isAuthenticated, deleteBlog);

module.exports = router;