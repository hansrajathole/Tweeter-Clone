
import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLenght: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
    profilePicture: {
        type: String,
        default: '',
    },
    coverPicture: {
        type: String,
        default: '',
    },
    bio : {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '',
    },

});


userSchema.methods.copmarePassword= async function(password){
    return await bcrypt.compare(password, this.password)
}   

userSchema.statics.hashPassword =  async function (password) {
    return await bcrypt.hash(password,10)
}




const User = mongoose.model('User', userSchema);
export default User;