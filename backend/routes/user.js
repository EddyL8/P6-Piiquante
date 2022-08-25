const express = require('express');
const router = express.Router();
//const passwordValidator = require('../middleware/password');
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); //passwordValidator, 
router.post('/login', userCtrl.login); //passwordValidator, 

module.exports = router;