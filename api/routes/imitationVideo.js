const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');

const { createVideo, getAll } = require('../controllers/imitationVideo');

// upload.uploadVideo.single('video'),
router.post('/', createVideo);
router.get('/:lastUpdated', getAll);

module.exports = router;