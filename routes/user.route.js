const express = require("express")
const router = express.Router()
const {getUserInformation,createUser,login,updateUserInformation, deleteAccount} = require("../controllers/user.controller")
const {authenticate} = require("../middlewares/auth.middleware")
const {uploadFile} = require("../utils/fileUpload.utils")
const upload = uploadFile("profileUploads")

router.get("/users/:userId",authenticate,getUserInformation)

router.post("/register",createUser)

router.post("/login",login)

router.patch("/users/update/:userId",[authenticate,upload.single('profilePicture')],updateUserInformation)

router.delete("/users/delete/:userId",[authenticate],deleteAccount)

module.exports = router
