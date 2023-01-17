const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (password != req.body.confirm_password) {
        console.log("Password not matching");
        req.flash("error", "Passwords not matching!!");
        return done(null, false);
      }
      //Check if user is already registered
      // const user =
      if (await User.findOne({ email })) {
        req.flash("error", "User already exists!!");
        return done(null, false);
      }

      // Hash the password before saving the doctor to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email: email,
        password: hashedPassword,
        name: req.body.name,
      });
      
      await user.save();
      
      return done(null, user);
    }
  )
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },

    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          // handle the error or return an error message if no user was found
          return done(null, false);
        }

        const isPasswordCorrrect = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordCorrrect) {
          req.flash("error", "Creds are wrong");
          return done(null, false);
        }

      
        // return the user
        return done(null, user);
      } catch (error) {
        return done(null, false);
      }
    }
  )
);

//Serialzing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Serialzing the user from the key in the cookie

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user -> Passport");
      return done(err);
    }
    return done(null, user);
  });
});

//check if user is authentcated
passport.checkAuthentication = function (req, res, next) {
  //If user is signed in then pass req to next -> Controller's action
  if (req.isAuthenticated()) {

    return next();
  }

  //if user is not signed In
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed In user from the session cookie
    //and we are just sending it to the locals for the views
    res.locals.user = req.user;
  }

  next();
};
module.exports = passport;
