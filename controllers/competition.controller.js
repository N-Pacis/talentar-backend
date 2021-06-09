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

        if(req.user._id != competition.CreatedBy){
            return res.send(formatResult({
                status: 401,
                message: "Access denied you can't add member to this competition"
            }))
        }

        let user = await User.findById(req.body.userId)
        if(!user) return res.status(400).send("The user does not exist")

        let foundMember = competition.Members.filter(member=>{
            return member.userId == req.body.userId
        })
        if(foundMember.length == 0){
            competition.Members.push(req.body)
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


exports.approveMember = async(req,res)=>{
    try{
        
        let competition = await Competition.findById(req.params.competitionId)
        if(!competition) return res.status(400).send("The competition does not exist")
        
        if(req.user._id != competition.CreatedBy){
            return res.send(formatResult({
                status: 401,
                message: "Access denied you can't approve a member to this competition"
            }))
        }
        let members = (competition.Members).filter(member=>{
           return member.userId == req.params.userId
        })
        
        let updateCompetitionIndex = competition.Members.findIndex(member => member.userId = members[0].userId);
        competition.Members[updateCompetitionIndex].status = "Approved";
        try{
            await Competition.findByIdAndUpdate(req.params.competitionId,{
                Members:{
                    userId: competition.Members[updateCompetitionIndex].userId,
                    votes: competition.Members[updateCompetitionIndex].votes,
                    status: competition.Members[updateCompetitionIndex].status 
                }
            },{new:true});
            return res.send(formatResult({
                status:201,
                message:"Member approved added successfully!",
                data:competition
            }))
        }
        catch(ex){
            res.status(400).send(ex.message);
        }
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
}

exports.voteMember = async(req,res)=>{
    try{
        let competition = await Competition.findById(req.params.competitionId)
        if(!competition) return res.status(400).send("The competition does not exist")

        let user = await User.findById(req.params.userId)
        if(!user) return res.status(400).send("The user does not exist")

        let members = (competition.Members).filter(member=>{
            return member.userId == req.params.userId
        })
        if(members[0].votes.includes(req.user._id)){
            return res.status(400).send("You can not vote the same user for the second time!");
        }
        else{
            competition.Members[0].votes.push(req.user._id)
            try{
                await Competition.findByIdAndUpdate(req.params.competitionId,{
                    Members:{
                        userId: competition.Members[0].userId,
                        votes: competition.Members[0].votes,
                        status: competition.Members[0].status 
                    }
                },{new:true});
                return res.send(formatResult({
                    status:201,
                    message:"Vote added successfully!",
                    data:competition
                }))
            }
            catch(ex){
                res.status(400).send(ex.message);
            }
        
    }
   }
    catch(ex){
        res.status(500).send(ex.message)
    }
}