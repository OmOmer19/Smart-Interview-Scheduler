const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

//google OAuth controller

const googleLogin = async(req,res) =>{
    res.json({
        message: "Google OAuth Coming Next"
    })
}
module.exports = {googleLogin}