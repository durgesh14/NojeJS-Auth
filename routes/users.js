const express = require('express');
const router = express.Router();
const passport = require('passport');


const usersController = require('../controllers/users_controller');

router.get('/sign-up', usersController.signup);
router.post('/sign-up', passport.authenticate(
    'local-signup',
    {failureRedirect: '/users/sign-up'}
) ,usersController.createUser);

router.get('/sign-in',usersController.signIn);
router.post('/sign-in', passport.authenticate(
    'local-signin',
    {failureRedirect: '/users/sign-in'}
),usersController.createSession);

router.get('/profile',  passport.checkAuthentication, usersController.profile);


router.get('/sign-out', usersController.destroySession);

router.get('/reset-pass', passport.checkAuthentication, usersController.getreset);

router.post('/reset-pass', usersController.resetPassword);
router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createUser);

router.get('/forgot-password', usersController.getforgot);
router.post('/forgot-password', usersController.forgotPass);
module.exports = router;