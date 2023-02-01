const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;

const crypto = require("crypto");
const User = require("../models/user");
require("dotenv").config();

//usesing passport.use to create a new googleStrategy instance
passport.use(
    /*
    The googleStrategy takes an object with clientID, clientSecret, 
    and callbackURL as options, and a callback function as its second argument.  
     */
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:8000/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        //see if the user exists in the database
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        }

        //If the user doesn't exist, using User.create to create a new user
        const loggedInUser = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          password: crypto.randomBytes(20).toString("hex"),
        });

        return done(null, loggedInUser);
      } catch (error) {
        console.log("Error in creating user: ", error);
        return done(null, false);
      }
    }
  )
);

module.exports = passport;
