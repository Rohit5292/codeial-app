const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// for generating random password
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use new google auth strategy
passport.use(new GoogleStrategy({
  // details obtained from google cloud console
  clientID: "774647264252-pe8ua03hmvvv34j45bcb1cddgcqv95at.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "/auth/google/callback",  
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({ email: profile.emails[0].value })
    .exec()
    .then(user => {
      if (user) {
        return done(null, user);
      } else {
        User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString('hex')
        })
        .then(newUser => {
          return done(null, newUser);
        })
        .catch(err => {
          console.log('Error in creating user', err);
          return done(err);
        });
      }
    })
    .catch(err => {
      console.log('Error in Google strategy passport:', err);
      return done(err);
    });
}));

module.exports = passport;
