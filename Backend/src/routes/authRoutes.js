// google oAuth route
// to handle google oauth authentication
const express = require("express")
const router = express.Router()
const passport = require("passport")
const jwt = require("jsonwebtoken")

// google OAuth login route - google redirects interviewer to google
router.get("/google",
    passport.authenticate("google",{
        // request access to profile info and email address from google
        scope: ["profile","email"],
        // accesstype: offline -> tell google we need refresh token
        accessType: "offline",
        // prompt: 'consent' -> forces google to show consent screen so refresh token is returned again
        prompt: "consent"
    })
)

// google Oauth callback route - google redirects here after login
router.get("/google/callback",
    passport.authenticate("google",{
        //disabling session because we use JWT authentication
        session: false,
        // if google authentication fails
        failureRedirect:"/"
    }),
    // if authentication succeeds -callback function
    async (req,res) =>{
        try{
            //generating jwt token
            const token = jwt.sign(
                {id: req.user._id,
                 email: req.user.email
                },process.env.JWT_SECRET,
                {
                    expiresIn:"7d"
                }
            )
            //sending response
            res.status(200).json({
                message: "Google Authentication Successful",
                token,
                user:{
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email
                }
            })
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }
)

module.exports = router