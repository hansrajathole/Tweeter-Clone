import {v2 as cloudinary} from "cloudinary"
import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"
export const getUserProfile = async function (req,res) {
    const {username} = req.params
    
    try {
        const user = await User.findOne({username : username}).select("-password")
        
        if(!user){
            res.status(400).json({message : "User not found"})
        }

        res.status(200).json(user)
    } catch (error) {
        console.log("error in getUserProfile" , error.message);
        res.status(500).json({error : error.message})
    }
}

export const followUnfollowUser = async function (req,res) {
    try {
        const {id} = req.params
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if(id===req.user._id.toString()){
            return res.status(400).json({error : "you can't follow or unfollow your self"})
        }

        if(!userToModify || !currentUser){
            return res.status(400).json({error : "user not found"})
        }

        const isfollowing = currentUser.following.includes(id)

        if(isfollowing){
            await User.findByIdAndUpdate(id,{$pull:{followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id ,{ $pull : { following : id }})

            //  TODO: return the id of the user as response
            res.status(200).json({message : "User unfollowed successfully"})
        }else {
            await User.findByIdAndUpdate(id,{$push:{followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id ,{ $push : { following : id }})
            
            const newNotification = new Notification({
                type : "follow",
                from : req.user._id,
                to : userToModify._id
            })
            
            await newNotification.save()
            //  TODO: return the id of the user as response
            res.status(200).json({message : "User followed successfully"})
                    
        }


    } catch (error) {
        console.log("error in followUnfollowUser ", error.message);
        res.status(500).json({error : error.message})
        
    }
}


export const getSuggestedUsers = async function (req, res) {
    
    try {
        
        const userId = req.user._id
        const usersFollowedByMe = await User.findById(userId).select("following")
        // console.log(usersFollowedByMe);
        
        const users = await User.aggregate([
            {
                $match :{
                    _id: {$ne: userId}
                }
            },{
                $sample:{size:10}
            }
        ])
        
        const filteredUsers = users.filter((user)=> !usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach(user=>user.password=null)

        res.status(200).json(suggestedUsers)



    } catch (error) {
        console.log("error in getSuggested Users", error.message);
        res.status(500).json({ error : error.message})
    }

}

export const updateUser = async function (req, res) {

    const {fullname , email , username ,newPassword , currentPassword ,  bio , link} = req.body
    const { profilePicture, coverPicture } = req.body
    const userId = req.user._id

    try {
        
        let  user = await User.findById(userId)
        
        if(!user){
            return res.status(404).json({message : "user not foud"})
        }

        if((!currentPassword &&newPassword) || (!newPassword && currentPassword)){
            return res.status(400).json({error : "Please provide both current password and new password"})
        }

        if(currentPassword && newPassword){

            const isMatch = await user.copmarePassword(currentPassword)

            if(!isMatch) return res.status(400).json({error : "current password is incorect"})

            if(newPassword.length < 6) return res.status(400).json({error : "Password must be at least 6 charactor long"})

            user.password = await User.hashPassword(newPassword)

        }

        if(profilePicture){
            const uploadedResponse = await cloudinary.uploader.upload(profilePicture)
            profilePicture = uploadedResponse.secure_url
        }
        if(coverPicture){
            const uploadedResponse = await cloudinary.uploader.upload(coverPicture)
            coverPicture = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname
        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profilePicture = profilePicture || user.profilePicture
        user.coverPicture = coverPicture || user.coverPicture

        user = await user.save()

        user.password = null

        res.status(200).json(user)


    } catch (error) {
        console.log("error in update User")
        res.status(500).json({error : error.message})
    }
}