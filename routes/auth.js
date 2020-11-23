const express = require('express');
const router = express.Router();

const  { signup , signin , signout ,requireSignin , googleLogin ,forgotPassword,resetPassword, socialLogin} = require ('../controllers/auth');
const  {userSignupValidator, passwordResetValidator} = require('../validator/index')

router.post('/signup',userSignupValidator,signup);
router.post('/signin',signin);

router.get('/signout',signout);
router.put('/forgotpassword', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);
router.post('/social-login', socialLogin); 

// router.post('/google-login', googleLogin);
module.exports = router;


