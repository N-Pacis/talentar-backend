
const { formatResult } = require("../utils/formatter");
const _ = require("lodash")
const debug = require("debug");
const { Post, postValidation } = require("../models/posts.model");
const error = debug('error')


exports.creatingPost = async (req, res) => {
    try {
        const { error } = postValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        if (req.file == {} || req.file == null) {
            return res.status(400).send("A post must have an image or a URL");
        }

        let newPost = new Post(_.pick(req.body, ['caption', 'Category', 'location']))
        newPost.userId = req.user._id;
        newPost.url = req.file.path;

        try {
            await newPost.save()
            res.send(formatResult({
                status: 201,
                message: "post created successfully",
                data: newPost
            }))
        }
        catch (ex) {
            res.status(400).send(ex.message);
            error(ex.message)
        }
    }
    catch (ex) {
        res.status(500).send("Something Failed! Try Again!");
        error(ex)
    }
}

exports.gettingOnePost = async (req, res) => {
    try {
        const postFound = await Post.findById(req.params.id)
        if (!postFound)
            return res.send(formatResult({
                status: 404,
                message: "no post found"
            }))
        return res.send(formatResult({
            status: 200,
            message: "ok",
            data: postFound
        }))

    } catch (error) {
        res.send(error)
    }
}

exports.gettingAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        return res.send(formatResult({
            status: 200,
            message: "Ok",
            data: posts
        }))
    }
    catch (err) {
        res.send(err)
    }
}

exports.gettingUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
        return res.send(formatResult({
            status: 200,
            message: "Ok",
            data: posts
        }))
    }
    catch (err) {
        res.send(err)
    }
}

exports.gettingFollowArtPosts = async (req, res) => {
    try {
        const loggedInUser = req.user.following;

        const posts = await Post.find({ userId: { $in: loggedInUser } })
        return res.send(formatResult({
            status: 200,
            message: "Ok",
            data: posts
        }))
    }
    catch (err) {
        res.send(err)
    }
}

exports.gettingArtGeneralPosts = async (req, res) => {
    try {
        const posts = await Post.find({ Category: "Art" }).sort({ likes: -1 })
        return res.send(formatResult({
            status: 200,
            message: "Ok",
            data: posts
        }))
    }
    catch (err) {
        res.send(err)
    }
}

exports.deletingPost = async (req, res) => {
    try {
        const { error } = postValidation(req.body);
        if (error) return res.send(formatResult({
            status: 400,
            message: error.details[0].message
        }))
        Province.findByIdAndRemove(req.params.id)
    }
    catch (err) {
        res.send(err)
    }
}