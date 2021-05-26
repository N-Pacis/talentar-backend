const express = require("express")
const router = express.Router()
const {getUserInformation,sendResetLink, createUser,login,updateUserInformation,changePassword,resetPassword, deleteAccount} = require("../controllers/user.controller")
const {authenticate} = require("../middlewares/auth.middleware")
const {uploadFile} = require("../utils/fileUpload.utils")
const upload = uploadFile("profileUploads")

router.get("/users/:userId",authenticate,getUserInformation)

router.get("/sendResetLink/:userId",authenticate,sendResetLink)

router.post("/register",createUser)

router.post("/login",login)

router.post("/resetPassword/:userId/:token",authenticate,resetPassword)

router.patch("/users/update/:userId",[authenticate,upload.single('profilePicture')],updateUserInformation)

router.patch("/users/changePassword/:userId",authenticate,changePassword)

router.patch("/users/resetPassword/:userId",authenticate,resetPassword)

router.delete("/users/delete/:userId",authenticate,deleteAccount)

module.exports = router
