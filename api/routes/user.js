const express = require('express');
const router = express.Router();

const {
    connect, getAll
} = require('../controllers/user');

router.post('/sign-up', connect);
router.get('/:lastUpdated', getAll);

module.exports = router;