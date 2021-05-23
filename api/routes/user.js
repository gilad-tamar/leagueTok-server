const express = require('express');
const router = express.Router();

const {
    connect
} = require('../controllers/user');

router.post('/sign-up', connect);

module.exports = router;