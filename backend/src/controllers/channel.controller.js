import userModel from "../models/user.model.js";
import channelModel from "../models/channel.model.js";
import { uploadFile } from "../services/storage.service.js";
import jwt from "jsonwebtoken"
import {config} from "../configs/config.js"

export const createChannel = async (req,res)=>{
    const {name ,handle ,description} =req.body;
    const avatarFile = req.files?.avatar?.[0];
    const bannerFile = req.files?.banner?.[0];
    const userId = req.user.id;

    try{
        const findchannel = await channelModel.findOne({ owner: userId });
        if (findchannel) {
            return res.status(400).json({
                message: "channel already created",
                success: false
            })
        }
        const handleExists = await channelModel.findOne({ handle });

        if (handleExists) {
            return res.status(400).json({
                message: "handle already taken",
                success: false
            });
        }
        let avatarUri=""
        if (avatarFile) {
            const uploaded = await uploadFile({
                buffer: avatarFile.buffer,
                fileName: avatarFile.originalname
            });
            avatarUri = uploaded.url;
        }

        let bannerUri=""
        if (bannerFile) {
            const uploaded = await uploadFile({
                buffer: bannerFile.buffer,
                fileName: bannerFile.originalname
            });
            bannerUri = uploaded.url;
        }


        const channel = await channelModel.create({
            name,
            handle,
            description,
            owner: userId,
            avatar: avatarUri,
            banner: bannerUri
        })

        return res.status(200).json({
            message:"channel created successfully",
            success:true,
            channel 
        })


    } catch (error) {
        console.log("error in create channel : ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateChannel =async (req,res)=>{
    const {name ,description} =req.body;
    const avatarFile = req.files?.avatar?.[0];
    const bannerFile = req.files?.banner?.[0];
    const userId = req.user.id;

    try {
        const channel = await channelModel.findOne({ owner: userId });

        if(!channel){
            return res.status(400).json({
                message:"channel not found",
                success:false
            })
        }

        if (name) channel.name = name;
        if (description) channel.description = description;

        if (avatarFile) {
            const uploaded = await uploadFile({
                buffer: avatarFile.buffer,
                fileName: avatarFile.originalname
            });
            channel.avatar = uploaded.url;
        }

        if (bannerFile) {
            const uploaded = await uploadFile({
                buffer: bannerFile.buffer,
                fileName: bannerFile.originalname
            });
            channel.banner = uploaded.url;
        }

        await channel.save();

        return res.status(200).json({
            message:"channel update successfully",
            success:true,
            channel
        })


    }catch(error){
        console.log("error in update channel : ",error);
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const deleteChannel = async (req,res)=>{
    const { handle } = req.params;
    const userId = req.user.id;

    try {
        const channel = await channelModel.findOne({ handle });

        if (!channel) {
            return res.status(404).json({
                message: "channel not found",
                success: false
            });
        }


        if (channel.owner.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to delete this channel",
                success: false
            });
        }

        // ✅ delete channel
        await channelModel.findByIdAndDelete(channel._id);

        return res.status(200).json({
            message: "channel deleted successfully",
            success: true
        });

    } catch (error) {
        console.log("error in delete channel : ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getMyChannel =async (req,res)=>{
    const userId =req.user.id;

    try{
        const channel =await channelModel.findOne({owner : userId});

        if(!channel){
            return res.status(400).json({
                message:"channel not found",
                success:false
            })
        }

        return res.status(200).json({
            message:"channel found",
            success:true,
            channel:{
                id:channel._id,
                name:channel.name,
                description:channel.description,
                handle:channel.handle,
                avatar:channel.avatar,
                banner:channel.banner,
                subscriberCount: channel.subscriberCount || 0
            }
        })
    }catch(error){
        console.log("error in get my channel : ",error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getChannelByHandle = async (req, res) => {
    const { handle } = req.params;

    try {
        let channel = await channelModel.findOne({ handle });
        
        // Fallback: in case the route passed an _id as handle
        if (!channel && handle.length === 24) {
            channel = await channelModel.findById(handle);
        }

        if (!channel) {
            return res.status(404).json({
                message: "channel not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "channel found",
            success: true,
            channel: {
                id: channel._id,
                name: channel.name,
                description: channel.description,
                handle: channel.handle,
                avatar: channel.avatar,
                banner: channel.banner,
                owner: channel.owner,
                subscriberCount: channel.subscriberCount || 0
            }
        });
    } catch (error) {
        console.log("error in get channel by handle: ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}