const {validateCompetition,Competition} = require("../models/competition.model")
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
                message: "no post found"
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