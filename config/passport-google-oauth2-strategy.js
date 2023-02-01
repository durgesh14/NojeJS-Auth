const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');
const User = require('../models/user');
require('dotenv').config()

passport.use( new googleStrategy(
{
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://nodejsauth.onrender.com/users/auth/google/callback",
}
,

async function(accessToken, refreshToken, profile, done){
    try {
        const user = await User.findOne({email: profile.emails[0].value});
    if(user){
        return done(null, user);
    }

    const loggedInUser = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        password: crypto.randomBytes(20).toString('hex')
    });
    
    return done(null, loggedInUser);
    } catch (error) {
        console.log("Error in creating user: ", error);
        return done(null, false);
    }
 

    
}
    ));


    module.exports = passport;

