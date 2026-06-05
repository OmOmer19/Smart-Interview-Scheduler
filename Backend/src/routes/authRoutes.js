// google oAuth route
// to handle google oauth authentication
const express = require("express")
const router = express.Router()
const passport = require("passport")

// google OAuth login route - google redirects interviewer to google
router.get("/google",
    passport.authenticate("google",{
        // request access to profile info and email address from google
        scope: ["profile","email"]
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
    // if authentication succeeds
    (req,res) =>{
        //temporary res
        res.json({
            message: "Google authentication successful",
            user: req.user
        })
    }
)

module.exports = router