const express = require('express');
const passport = require('passport');
const {
  test,
  login,
  signUp,
  createUser,
  createSession,
  home,
  profile,
  changePassword,
  updatePassword,
  destroySession,
  renderResetPassword
} = require('../controller/userController');
const authenticate = require('../config/passport');
const route = express.Router();

// Initialize Passport
route.use(passport.initialize());

// Define routes
route.get('/', home);
route.get('/profile', authenticate.checkAuthentication, profile);
route.get('/login', login);
route.get('/signup', signUp);
route.post('/create', createUser);
route.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/login' }),
  createSession
);
route.get('/change-password', changePassword);
route.post(
  '/update-password',
  passport.authenticate('local', { failureRedirect: 'back' }),
  updatePassword
);
route.get('/reset-password', renderResetPassword);
route.get('/destroy-session', destroySession);

// Define routes for Google authentication
route.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback from Google
route.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  createSession
);

module.exports = route;
