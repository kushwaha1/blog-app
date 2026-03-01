const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.post('/signup', upload.single('profileImage'), signup);
router.post('/login', login);
router.get('/me', isAuthenticated, getMe);

module.exports = router;