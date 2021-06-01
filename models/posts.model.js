const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    Category: {
        type: String,
        enum: ['Photography', 'Art', 'Design', 'Singing'],
        required: true
    },
    location: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    reviews: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
    unlikes: {
        type: Array,
        default: []
    }
})

exports.postValidation=(post)=> {
    const schema = {
        caption: Joi.string(),
        Category: Joi.string().valid('Photography', 'Art', 'Design', 'Singing'),
        location: Joi.string()
    }
    return Joi.validate(post,schema)
}

module.exports.Post = mongoose.model("posts", postSchema);
