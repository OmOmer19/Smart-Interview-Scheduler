const mongoose = require("mongoose")

// interviewer model
//store google oauth info
const userSchema = new mongoose.Schema({
    // interviewe basic info
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    //goggle OAuth
    googleId:{
        type: String,
        required: true,
        unique: true
    },
    //google token
    accessToken:{
        type: String,
        required: true
    },
    // refresh
    refreshToken:{
        type: String,
        default:null
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User