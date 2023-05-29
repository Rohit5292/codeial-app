const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        req.flash('error', 'User not registered. Kindly sign up first.');
        console.log('Invalid email');
        return done(null, false);
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash('error', 'Wrong password');
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error);
    }
  })
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(err => {
      console.log(err);
      return done(err);
    });
});

passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

passport.saveAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = {
  passport,
  checkAuthentication: passport.checkAuthentication,
  saveAuthenticatedUser: passport.saveAuthenticatedUser
};
