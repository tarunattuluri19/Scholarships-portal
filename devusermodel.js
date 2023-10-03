const mongoose = require('mongoose')

const devuser = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    aadharnumber:{
        type:Number,
        required:true,
        unique:true,
    },
    contactnumber:{
        type:Number,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    college:{
        type:String,
        required:true,
    },
    educationlevel:{
        type:String,
        required:true,
    },
    admissioncategory:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    income:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        required:true,
    }
})


module.exports = mongoose.model("devuser",devuser)