const mongoose = require("mongoose")
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

function validateUserRegistration(user){
    const schema = {
        firstname:Joi.string().min(3).required(),
        lastname:Joi.string().min(3).required(),
        Email:Joi.string().min(5).required(),
        Username:Joi.string().min(4).required(),
        Password:Joi.string().min(6).required(),
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
        minLength:4,
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
    }
})
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,username:this.username},config.get("JWT"))
    return token
}

const User = mongoose.model('user',userSchema)

exports.validateRegistration = validateUserRegistration
exports.validateLogin = validateUserLogin
exports.User = User
