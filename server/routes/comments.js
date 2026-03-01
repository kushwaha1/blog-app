const express = require('express');
const router = express.Router();
const { addComment, addReply } = require('../controllers/commentController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/:blogId', isAuthenticated, addComment);
router.post('/:blogId/:commentId/reply', isAuthenticated, addReply);

module.exports = router;