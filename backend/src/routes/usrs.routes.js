import express from "express"
import { protectRoute } from "../middleware/protectRout.js"
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from "../controller/users.controller.js"
const router = express()

router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.get("/follow/:id",protectRoute,followUnfollowUser)
router.get("/update",protectRoute,updateUser)


export default router