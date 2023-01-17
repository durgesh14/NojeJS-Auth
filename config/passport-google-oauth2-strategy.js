const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');
const User = require('../models/user');

passport.use( new googleStrategy(
{
    clientID: "1089780743379-gif5h3spl9vvqe2gaiuq85eohipknafe.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://127.0.0.1:8000/users/auth/google/callback",
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

