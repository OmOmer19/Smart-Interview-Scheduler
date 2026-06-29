// to convert stored accesstoken + refresh token into a google authenticated client that can call calender api
// also handles automatic token refresh when access token expires

const {google} = require("googleapis")
const User = require('../models/userModel')

const getOAuthClient = (accessToken, refreshToken) =>{
    // creating the Oauth2 client using the credential from google cloud
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    )
    // attaching user tokens to client
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    })
    // listening for token refresh event
    // google automatically refreshes the token when it expires
    // saving the new token to db so it stays valid
    oauth2Client.on("tokens", async(tokens) =>{
        if(tokens.access_token){
            try{
                // updating the new access token in db
                // finding user(interviewer)  by refresh token since we don't have user id here
                await User.findOneAndUpdate(
                    {refreshToken: refreshToken},
                    { $set: {accessToken: tokens.access_token}}
                )
                console.log("Access token refreshed and saved")
            }
            catch(err){
                console.error("Failed to save refreshed token:", err.message)
            }
        }
    })
    // returning configured client
    return oauth2Client
}
module.exports = {getOAuthClient}