import jwt from "jsonwebtoken"
import {config} from "../configs/config.js"
import userModel from "../models/user.model.js"

export const authenticateUser=async (req,res,next)=>{
    const token = req.cookies?.token || req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    try{
        const decoded =jwt.verify(token,config.JWT_SECRET);

        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        req.user =user
        next()
    } catch (error) {
        console.log("error in auth middleware : ", error);
    }
};

export const optionalAuthenticateUser = async (req, res, next) => {
    const token = req.cookies?.token || req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        next();
    }
};