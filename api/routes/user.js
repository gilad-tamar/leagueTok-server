const express = require('express');
const router = express.Router();
// const checkAuth = require('../middlewares/checkAuth');

const {
    signup,
    login
} = require('../controllers/user');

router.post('/login', login);

//Admin
// consider add checkAuth middleware
router.post('/signup', signup);

module.exports = router;