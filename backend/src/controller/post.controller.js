import User from "../models/user.model.js"
import Post from "../models/posts.model.js"
import {v2 as cloudinary} from "cloudinary"
export const createPost = async(req,res) => {
    try {
        const {img} = req.body
        let {text} = req.body
        const userId = req.user._id.toString()

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        if(!img && !user){
            return res.status(400).json({ message: 'No image or text provided' });
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save()
        
        return res.status(201).json(newPost)

    } catch (error) {
        console.log("Error in CreatePost Controller "+ error);
        return res.status(500).send({ message: 'Internal Server Error' });
        
    }
}

export const deletePost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }
        if(post.user.toString()!==req.user._id.toString()){
            return res.status(401).json({ message: 'You are Unauthorized user' });
        }

        if(post.img){
            const img = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(img)
        }

        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log("Error in DeletePost Controller "+ error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}