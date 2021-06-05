const {validateCompetition,validateMemberRegistration,Competition} = require("../models/competition.model")
const {User} = require("../models/user.model")

const _ = require("lodash")
const { formatResult } = require("../utils/formatter");

exports.getAllCompetitions = async(req,res)=>{
    try{
        let competition = await Competition.find().sort({Members:-1})

        return res.send(formatResult({
            status: 200,
            message: "ok",
            data: competition
        }))
    }
    catch(ex){
       res.status(400).send(ex.message)
    }
}

exports.getCompetition = async(req,res)=>{
    try{
        let competition = await Competition.findById(req.params.competitionId)
        if(!competition){
            return res.send(formatResult({
                status: 404,
                message: "no competition found"
            }))
        }

        return res.send(formatResult({
            status: 200,
            message: "ok",
            data: competition
        }))
    }
    catch(ex){
       res.status(400).send(ex.message)
    }
}

exports.createCompetition = async(req,res)=>{
    try{
        const {error} = validateCompetition(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        if (req.file == {} || req.file == null) {
            return res.status(400).send("A competition must have a cover photo");
        }

        let newCompetition = new Competition(_.pick(req.body,['CompetitionName','Category','Description','DueDate','Requirements']))
        newCompetition.CoverPhoto = req.file.path
        newCompetition.CoverPhoto = ((newCompetition.CoverPhoto).replace("\\","/")).replace(" ","%20")
        newCompetition.CreatedBy= req.user._id;

        try{
            await newCompetition.save()
            res.send(formatResult({
                status:201,
                message:"Competition created successfully",
                data:newCompetition
            }))
        }
        catch(ex){
            res.status(400).send(ex.message)
        }
    }   
    catch(ex){
           res.status(500).send(ex.message)
    }
}

exports.deleteCompetition = async(req,res)=>{
    try{
        let competition = await Competition.findByIdAndRemove(req.params.competitionId)
        if(!competition){
            return res.send(formatResult({
                status: 404,
                message: "no competition found"
            }))
        }
        if(req.user._id != competition.CreatedBy){
            return res.send(formatResult({
                status: 401,
                message: "Access denied you can't delete this competition"
            }))
        }
        return res.send("Competition deleted successfully")
    }
    catch(ex){
         res.status(500).send(ex.message)
    }
}

exports.addMember = async(req,res)=>{
    try{
        const {error} = validateMemberRegistration(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        let competition = await Competition.findById(req.params.competitionId)
        if(!competition) return res.status(400).send("The competition does not exist")

        let user = await User.findById(req.body.userId)
        if(!user) return res.status(400).send("The user does not exist")

        let member = competition.Members.includes(req.body.userId)
        if(!member){
            competition.Members.push(req.body.userId)
            await competition.save()
            return res.send(formatResult({
                status:201,
                message:"Member Added successfully!",
                data:competition
            }))
        }
        return res.status(400).send("User is already among the members of this competition")
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
}