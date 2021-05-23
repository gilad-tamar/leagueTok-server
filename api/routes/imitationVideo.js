const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');

const { createVideo, getAll, getUserImitationVideos } = require('../controllers/imitationVideo');

// upload.uploadVideo.single('video'),
router.post('/', createVideo);
router.get('/:lastUpdated', getAll);
router.get('/:uid/:lastUpdated', getUserImitationVideos);

module.exports = router;