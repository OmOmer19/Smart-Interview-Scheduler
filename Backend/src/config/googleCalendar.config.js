// to convert stored accesstoken + refresh token into a google authenticated client that can call calender api

const {google} = require("googleapis")

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
    // returning configured client
    return oauth2Client
}
module.exports = {getOAuthClient}