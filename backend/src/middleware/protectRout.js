import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
export async function protectRoute(req, res, next) {
 
    try {
        const token = req.cookies.jwt;
        
        if(!token) {
            return res.status(401).json({ message: 'You need to be logged in' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await User.findById(decoded.userId);
        
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}