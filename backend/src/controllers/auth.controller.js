import userModel from "../models/user.model.js";
import { uploadFile } from "../services/storage.service.js";
import jwt from "jsonwebtoken"
import { config } from "../configs/config.js"
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
    const { fullname, email, password } = req.body;
    const avatar = req.file;
    try {
        const alreadyUser = await userModel.findOne({ email });

        if (alreadyUser) {
            return res.status(400).json({
                message: "user already exist",
                success: false
            })
        }

        let avatarUrl = "";
        if (avatar) {
            const uploaded = await uploadFile({
                buffer: avatar.buffer,
                fileName: avatar.originalname
            });
            avatarUrl = uploaded.url;
        }

        const user = await userModel.create({
            fullname,
            email,
            password,
            avatar: avatarUrl
        })

        const token = await jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            message: "user registered successfully",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                avatar: avatarUrl
            }
        })
    } catch (error) {
        console.log("error in register : ", error);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user not exist ",
                success: false
            })
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = await jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            message: "user login succefullt",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                avatar: user.avatar
            }
        })

    } catch (error) {
        console.log("error in login : ", error);
    }
}

export const getMe = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            message: "User not found",
            success: false
        });
    }

    return res.status(200).json({
        message: "user data fetch successfully",
        success: true,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            avatar: user.avatar
        }
    });
}

export const logout = async (req, res) => {
    try {
        await res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            message: "user logout ",
            success: true,
        })
    } catch (error) {
        console.log("error in logout : ", error);
    }
}

export const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { fullname } = req.body;
    const avatar = req.file;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        if (fullname) user.fullname = fullname;
        
        if (avatar) {
            const uploaded = await uploadFile({
                buffer: avatar.buffer,
                fileName: avatar.originalname
            });
            user.avatar = uploaded.url;
        }

        await user.save();

        return res.status(200).json({
            message: "profile update successfully",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                avatar: user.avatar
            }
        })

    } catch (error) {
        console.log("error in update profile : ", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}

export const changePassword = async (req, res) => {
    const userId = req.user.id;

    try {
        const { oldpassword, newpassword } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: false
            })
        }

        const isMatch = await user.comparePassword(oldpassword);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect old password",
                success: false
            });
        }

        if (!newpassword || newpassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false
            });
        }

        user.password = newpassword;

        await user.save();

        return res.status(200).json({
            message: "password change successfuuly",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                avatar: user.avatar
            }
        })
    } catch (error) {
        console.log("error in change password : ", error)
    }
}