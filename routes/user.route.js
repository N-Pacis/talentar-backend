const express = require("express")
const router = express.Router()
const {getUserInformation,createUser,login,updateUserInformation} = require("../controllers/user.controller")
const {authenticate} = require("../middlewares/auth.middleware")

router.get("/users/:userId",authenticate,getUserInformation)

router.post("/register",createUser)

router.post("/login",login)

router.patch("/users/update/:userId",authenticate,updateUserInformation)

module.exports = router
