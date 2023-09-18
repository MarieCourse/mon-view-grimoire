const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const loginRateLimiter = require('../middleware/rate-limit');

router.post('/signup', userCtrl.signup);
router.post('/login', loginRateLimiter, userCtrl.login);

module.exports = router;
