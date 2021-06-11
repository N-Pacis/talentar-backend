const mongoose = require("mongoose")
const Joi = require('joi')

function validateCompetitionRegistration(competition){
    const schema = {
        CompetitionName:Joi.string().min(2).required(),
        Category:Joi.string().valid('Photography','Art','Design','Singing').required(),
        Description:Joi.string().min(2).required(),
        DueDate:Joi.date().required(),
        Requirements:Joi.array(),
    }
    return Joi.validate(competition,schema)
}

const competitionSchema = new mongoose.Schema({
    CompetitionName:{
        type: String,
        required: true,
        minlength:2
    },
    Category:{
        type: String,
        required:true,
        enum:['Photography','Art','Design','Singing']
    },
    Description:{
        type:String,
        required:true,
        minlength:2
    },
    DueDate:{
        type:Date,
        required:true
    },
    Requirements:{
        type:Array,
        default:[]
    },
    CoverPhoto:{
        type:String,
        required:true
    },
    CreatedBy:{
        type:String,
        required:true
    },
    Members:{
        type:Array,
        default:[],
    }
})

const Competition = mongoose.model('competition',competitionSchema)

exports.Competition = Competition
exports.validateCompetition = validateCompetitionRegistration