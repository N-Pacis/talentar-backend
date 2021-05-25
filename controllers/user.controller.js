const {validateRegistration,validateLogin,validateUpdate,User} = require("../models/user.model")
const _= require("lodash")
const bcrypt = require("bcrypt")
const debug = require("debug")
const error = debug('error')
const fs = require("fs")

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
          Status:user.Status,
          
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
            req.file.path == "" ? req.file.path = "profileUploads/defaultProfilePicture.jpg" : null
            
            let oldProfilePicture = await User.findOne({_id:req.params.userId}).select("profilePicture")
            fs.unlink(oldProfilePicture.profilePicture,(err)=>{
                if(err){
                    console.log("Error deleting the file:" +err)
                }
            })

            let user = await User.findByIdAndUpdate(req.params.userId,{
                firstname: firstname,
                lastname:  lastname,
                Email:     Email,
                Username:  Username,
                Followers: Followers,
                Bio:       Bio,
                profilePicture: req.file.path,
                Category:  Category,
                Location:  Location,
                Status:    Status
            },{new:true}) 
            let profilePictureUrl = ((user.profilePicture).replace("\\","/")).replace(" ","%20")
            res.status(200).send({
                Firstname:user.firstname,
                Lastname:user.lastname,
                Email:user.Email,
                Username:user.Username,
                profilePictureUrl: profilePictureUrl,
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

exports.changePassword = async(req,res)=>{
    try{
        const {error} = validatePasswordChange(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        let oldPassword = await User.findOne({_id:req.params.id}).select("Password")
        
        if(req.body.oldPassword != oldPassword){
            return res.status(400).send("Invalid old password!")
        }
        
        if(req.body.repeatNewPassword != req.body.newPassword){
            return res.status(400).send("The new passwords must match!")
        }

        await User.findByIdAndUpdate(req.params.id,{Password:req.body.newPassword},{new:true})
        res.send("Password Updated Successfully");
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
}

exports.deleteAccount = async(req,res)=>{
    try{
       await User.findByIdAndRemove(req.params.userId)
       res.status(200).send("User deleted successfully")
    }
    catch(ex){
       res.status(400).send(ex.message)
    }
}