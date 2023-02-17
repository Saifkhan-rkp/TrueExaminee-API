const {Router} = require("express");
const {postSignup, postLogin, getVerify}= require('../controllers');

const router = Router();

router
.post('/login',postLogin)
.get('/signup')
.post('/signup',postSignup)
.get('/verify', getVerify);

module.exports = router;