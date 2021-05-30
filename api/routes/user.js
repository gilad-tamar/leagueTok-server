const express = require('express');
const router = express.Router();

const {
    connect, getAll, get, registerDeviceToken
} = require('../controllers/user');

router.post('/sign-up', connect);
router.get('/all/:lastUpdated', getAll);
router.get("/:uid", get);
router.put('/device', registerDeviceToken);

module.exports = router;