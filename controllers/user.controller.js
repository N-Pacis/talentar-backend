const {validateRegistration,validateLogin,validateUpdate,User} = require("../models/user.model")
const _= require("lodash")
const bcrypt = require("bcrypt")
const debug = require("debug")
const error = debug('error')
const {uploadFile} = require("../utils/fileUpload.utils")

exports.getUserInformation = async(req,res)=>{
   try{
      let user = await User.findById(req.params.userId).select("-Password");
      if(!user) return res.status(404).send("User not found!")
      res.status(200).send({
          Firstname:user.firstname,
          Lastname:user.lastname,
          Email:user.Email,
          Username:user.Username,
          profilePictureUrl:user.profilePicture,
          Followers:user.Followers.length,
          Bio:user.Bio,
          Category:user.Category,
          Location:user.Location,
          Status:user.Status
      })
   }
   catch(ex){
       res.status(400).send(ex.message)
   }
}

exports.createUser = async(req,res)=>{
   try{
       const {error} = validateRegistration(req.body)
       if(error) return res.status(400).send(error.details[0].message)

       if(req.body.Password != req.body.confirmPassword){
           return res.status(400).send("Both passwords must match!")
       }

       let user = await User.findOne({Username:req.body.Username})
       if(user) return res.status(400).send("Username is already registered!")

       let checkEmail = await User.findOne({Email:req.body.email})
       if(checkEmail) return res.status(400).send("Email is already registered!")

       user = new User(_.pick(req.body,['firstname','lastname','Email','Username','Password']))

       const salt = await bcrypt.genSalt(10)
       user.Password = await bcrypt.hash(user.Password,salt)

       try{
           await user.save()
           const token = user.generateAuthToken()
           const time = new Date()
           const hours = time.getHours()
           const greeting = (hours < 12 && hours>0)? 'Good Morning' : (hours > 12 && hours<17) ? 'Good Afternoon' : 'Good Evening'
           res.header('talentar-auth-token',token).send(`${greeting}  ${user.Username}`)
       }
       catch(ex){
           res.status(400).send(ex.message);
           error(ex.message)
       }
   }
   catch(ex){
       res.status(500).send("Something Failed! Try Again!");
       error(ex.message)
   }
}

exports.login = async(req,res)=>{
    try{
        const {error} = validateLogin(_.pick(req.body,["Username","Password"]))
        if(error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({Username:req.body.Username})
        if(!user) return res.status(400).send("Invalid Username or Password!")

        const validPassword = await bcrypt.compare(req.body.Password,user.Password)
        if(!validPassword) return res.status(400).send("Invalid Username or Password!")

        const token = user.generateAuthToken()
        const time = new Date()
        const hours = time.getHours()
        const greeting = (hours < 12 && hours>0)? 'Good Morning' : (hours > 12 && hours<17) ? 'Good Afternoon' : 'Good Evening'
        res.header('talentar-auth-token',token).send(`${greeting}  ${user.Username}`)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
}

exports.updateUserInformation = async(req,res)=>{
    try{
        const {error} = validateUpdate(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        try{
            let {firstname,lastname,Email,Username,Followers,Bio,Category,Location,Status} = req.body
            let user = await User.findByIdAndUpdate(req.params.userId,{
                firstname: firstname,
                lastname:  lastname,
                Email:     Email,
                Username:  Username,
                Followers: Followers,
                Bio:       Bio,
                Category:  Category,
                Location:  Location,
            },{new:true})

            res.status(200).send({
                Firstname:user.firstname,
                Lastname:user.lastname,
                Email:user.Email,
                Username:user.Username,
                profilePictureUrl:user.profilePicture,
                Followers:user.Followers.length,
                Bio:user.Bio,
                Category:user.Category,
                Location:user.Location,
                Status:user.Status
            })
        }
        catch(ex){
             res.status(400).send(ex.message)
        }
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
}