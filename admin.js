
const mongoose  = require('mongoose');

const admin = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    aadharnumber:{
        type:Number,
        required:true,
    },
    contactnumber:{
        type:Number,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:"admin",
    }
})

module.exports = mongoose.model("admin",admin)