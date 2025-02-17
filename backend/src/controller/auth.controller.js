import User from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export async function signupController(req, res) {
    try {
        const { fullname, username, email, password } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid Email' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const hashedPassword = User.hashPassword(password)

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profilePicture: newUser.profilePicture,
                coverPicture: newUser.coverPicture, 
            });

        } else {
            return res.status(400).send({ message: 'Invalid User Data' });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' }); 
    }
}

export async function loginController(req, res) {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        
        const user = await User.findOne({ username: username });
        console.log(user);
        
        if(!user){
            return res.status(400).json({message :'Invalid username or password'})
        }
        const ispasswordCorrect = await user.copmarePassword(password)
        console.log(ispasswordCorrect);
        
        if(!ispasswordCorrect) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture, 
        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' }); 
    }
}

export function logoutController(req, res) {    
    try {
        
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({ message: 'Logged Out successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
} 

export async function meController(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture, 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}