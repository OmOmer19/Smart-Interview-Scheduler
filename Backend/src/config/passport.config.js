// passport configuration
// to handle Google OAuth Strategy
const User = require("../models/userModel")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy

// Google OAuth Strategy
passport.use(
    new GoogleStrategy({
        // Google Client ID from .env
        clientID: process.env.GOOGLE_CLIENT_ID,
        // Google Client Secret from .env
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //callback url 
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        
    },
    async function (accessToken,refreshToken,profile,done){
        try{
            // getting profile info
            const googleId = profile.id
            const name = profile.displayName
            const email = profile.emails[0].value

            //  LOGS in console
            console.log("Access Token:", accessToken)
            console.log("Refresh Token:", refreshToken)
            console.log("Profile:", profile.displayName)
            
            //if user already
            let user = await User.findOne({googleId})
            if(user){
                //updating latest Oauth token
                user.accessToken = accessToken
                //google may not always send refresh token
                if(refreshToken){
                    user.refreshToken = refreshToken
                }
                //saving 
                await user.save()
            }
            else{
                // creating new interviewer
                user = await User.create({
                    name,
                    email,
                    googleId,
                    accessToken,
                    refreshToken
                })
            }
            // sending interviewer to passport
            return done(null, user)
        }
        catch(err){
            return done(err,null)
        }
    }
    )
)

module.exports = passport