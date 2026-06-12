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
        scope: [
            "profile",
            "email",
            // adding calendar and gmail scopes
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/gmail.send"
        ],
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
    // if authentication succeeds -callback function - redirect to frontend with token in URL
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
            // redirecting to frontend with token and user info in query params
            res.redirect(
                `${process.env.FRONTEND_URL}/auth/callback?token=${token}&id=${req.user._id}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`
            )
        }
        catch(err){
                res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`)
        }
    }
)
// public route - get all interviewers list
router.get("/interviewers", async (req, res) => {
    try {
        const User = require("../models/userModel")
        // only returning public info - no tokens
        const interviewers = await User.find({}, "name email _id")
        return res.status(200).json({
            message: "Interviewers fetched successfully",
            interviewers
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router