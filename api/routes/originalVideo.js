const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/originalVideo');

router.get('/:lastUpdated', getAll);
router.post('/', create);

module.exports = router;