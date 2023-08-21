const express = require('express');
const passport = require('passport');
const {
  profile,
  login,
  signUp,
  createUser,
  createSession,
  changePassword,
  updatePassword,
  destroySession,
  renderResetPassword
} = require('../controller/userController');
const authenticate = require('../config/passport');

const router = express.Router();

// Define routes with the /user/ prefix
router.get('/profile', profile);
router.get('/login', login);
router.get('/signup', signUp);
router.post('/create', createUser);
router.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/user/login' }),
  createSession
);
router.get('/change-password', changePassword);
router.post(
  '/update-password',
  passport.authenticate('local', { failureRedirect: 'back' }),
  updatePassword
);
router.get('/reset-password', renderResetPassword);
router.get('/destroy-session', destroySession);

// Define routes for Google authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/user/' }),
  createSession
);

module.exports = router;
