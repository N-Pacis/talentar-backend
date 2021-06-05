const {createCompetition,getCompetition,getAllCompetitions,addMember,deleteCompetition} = require("../controllers/competition.controller")
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { uploadFile } = require("../utils/fileUpload.utils")
const upload = uploadFile("competitionImages")

router.get("/competitions/:competitionId",authenticate,getCompetition)

router.get("/competitions",authenticate,getAllCompetitions)

router.post("/competitions/new",[upload.single('CoverPhoto'),authenticate],createCompetition)

router.patch("/competitions/:competitionId/members/new",authenticate,addMember)

router.delete("/competitions/:competitionId",authenticate,deleteCompetition)
module.exports=router