const mongoose = require("mongoose")
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

function validateUserRegistration(user){
    const schema = {
        firstname:Joi.string().min(3).required(),
        lastname:Joi.string().min(3).required(),
        Email:Joi.string().min(5).required(),
        Username:Joi.string().min(3).required(),
        Password:Joi.string().min(6).required(),
        confirmPassword:Joi.string().min(6).required()
    }
    return Joi.validate(user,schema)
}

function validateUserLogin(user){
    const schema = {
        Username:Joi.string().min(4).required(),
        Password:Joi.string().min(6).required(),
    }
    return Joi.validate(user,schema)
}

function validateUserUpdate(user){
    const schema = {
        firstname:Joi.string().min(3).required(),
        lastname:Joi.string().min(3).required(),
        Email:Joi.string().min(5).required(),
        Username:Joi.string().min(4).required(),
        Followers:Joi.array(),
        Bio:Joi.string().max(250),
        Category:Joi.string().valid('Standard','Photographer','Artist','Designer','Singer'),
        Location:Joi.string(),
        Status:Joi.string()
    }
    return Joi.validate(user,schema)
}

function validatePasswordChange(user){
    const schema = {
        oldPassword:Joi.string().min(6).required(),
        newPassword:Joi.string().min(6).required(),
        repeatNewPassword:Joi.string().min(6).required(),
    }
    return Joi.validate(user,schema)
}

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        minLength:3,
        required:true
    },
    lastname:{
        type:String,
        minLength: 3,
        required:true
    },
    Email:{
        type:String,
        minLength:5,
        unique:true,
        required:true
    },
    Username:{
        type:String,
        minLength:3,
        unique:true,
        required:true
    },
    Password:{
        type:String,
        minLength:6,
        required:true
    },
    Followers:{
        type:Array,
        default:[]
    },
    profilePicture:{
        type:String,
        default:'profileUploads/defaultProfilePicture.jpg'
    },
    Bio:{
        type:String,
        maxlength:250,
        default:""
    },
    Category:{
        type:String,
        enum:['Standard','Photographer','Artist','Designer','Singer'],
        default:'Standard'
    },
    Location:{
        type:String,
        default:''
    },
    Status:{
        type:String,
        default:'Active'
    }
})
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,username:this.username},config.get("JWT"))
    return token
}

const User = mongoose.model('user',userSchema)

exports.validateRegistration = validateUserRegistration
exports.validateLogin = validateUserLogin
exports.validateUpdate=  validateUserUpdate
exports.validatePasswordChange=  validatePasswordChange
exports.User = User
