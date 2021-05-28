const express = require('express');
const router = express.Router();

const {
    connect, getAll, get
} = require('../controllers/user');

router.post('/sign-up', connect);
router.get('/all/:lastUpdated', getAll);
router.get("/:uid", get);

module.exports = router;