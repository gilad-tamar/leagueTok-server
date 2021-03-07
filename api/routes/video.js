const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');

const {
    createVideo
} = require('../controllers/video');

// upload.uploadVideo.single('video'),
router.post('/', createVideo);

module.exports = router;