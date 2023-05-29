const express = require('express');
const route = require('./routes/route');
const cookieParser = require('cookie-parser');
require('./config/mongoose');
const session = require('express-session');
const app = express();
const passport = require('passport');
const passportLocal = require('./config/passport');
const MongoStore = require('connect-mongodb-session')(session);
const GoogleStrategy = require('./config/passportGoogle');
const flash = require('connect-flash');
const message = require('./config/middleware')


const port = 8000;
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data
app.use(express.json()); // Middleware to parse JSON data

app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(express.static('assets'));

app.use(
  session({
    name: '__node_auth_login__',
    secret: '1234',
    resave: false,
    saveUninitialized: false, //set cookies if session gets created by passport
    cookie: { maxAge: 1000 * 60 * 40 }, //set expiration to 40 min
    store: new MongoStore({
      url: 'mongodb://localhost:27017',
      collection: 'sessions',
      autoRemove: 'native',
    }),
  })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passportLocal.saveAuthenticatedUser); // Fixed the function name here
  app.use(flash());
  app.use(message.messages);
app.use(route);

app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server: " + err);
  } else {
    console.log('Server started running.');
  }
});
