const {createCompetition,getCompetition,getAllCompetitions,addMember,approveMember,voteMember,deleteCompetition} = require("../controllers/competition.controller")
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { uploadFile } = require("../utils/fileUpload.utils")
const upload = uploadFile("competitionImages")

router.get("/competitions/:competitionId",authenticate,getCompetition)

router.get("/competitions",authenticate,getAllCompetitions)

router.post("/competitions/new",[upload.single('CoverPhoto'),authenticate],createCompetition)

router.patch("/competitions/:competitionId/members/new",authenticate,addMember)

router.patch("/competitions/:competitionId/members/approve/:userId",authenticate,approveMember)

router.patch("/competitions/:competitionId/members/vote/:userId",authenticate,voteMember)

router.delete("/competitions/:competitionId",authenticate,deleteCompetition)

module.exports=router