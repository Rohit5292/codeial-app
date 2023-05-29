const User = require("../models/user");
const passport = require('../config/passport');
const bcrypt = require("bcrypt");

module.exports.home = (req, res, next) => {
  res.render('home');
};

module.exports.profile = (req, res, next) => {
  res.render('profile');
};

// Render sign-in page
module.exports.login = (req, res, next) => {
  res.render('login');
};

// Render sign-up page
module.exports.signUp = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/profile');
  }
  console.log(req.flash().error)
 return  res.render('signup'); // Pass the flash message to the view
};


// Get the sign-up data
module.exports.createUser = async (req, res, next) => {
  if (req.body.password !== req.body['confirm_password']) {
    req.flash('error', 'Password and confirm password are different');
    return res.redirect('back');
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      req.flash('error', 'email already registered kindly login');
      return res.redirect('back');
    }

    const plaintextPassword = req.body.password;
    const saltRounds = 10;
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
    return res.redirect('back');
  }
};

module.exports.createSession = (req, res, next) => {
  res.redirect('/profile');
};

module.exports.changePassword = (req, res, next) => {
  res.render('changePassword');
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'user not found');
      return res.redirect('back');
    }
    // Match current password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      req.flash('error', 'password is not correct');
      console.log('Current password entered is invalid, please try again.');
      return res.redirect('back');
    }

    const plaintextPassword = req.body.new_password;
    const saltRounds = 10;
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);
    user.password = hash;
    await user.save();
    console.log('Password updated');
    return res.redirect('/destroy-session');
  } catch (err) {
    console.log('Error in resetting password:', err);
    return res.redirect('back');
  }
};

// Destroy session
module.exports.destroySession = function (req, res) {
  req.logout(function(err) {
    if (err) {
      console.log('Error logging out:', err);
      return res.redirect('/');
    }
    console.log("Logged out");
    return res.redirect('/');
  });
};

module.exports.renderResetPassword = (req, res) => {
  return res.render('changePassword', { title: 'Reset Password', user: req.user });
};
