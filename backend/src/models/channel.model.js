import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true 
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    // 🔗 Unique handle (like @avinash)
    handle: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    avatar: {
        type: String,
        default:"https://ik.imagekit.io/Avinash/E-commerce/Screenshot%202026-02-14%20at%203.28.35%E2%80%AFPM.png?updatedAt=1776775229438"
    },

    banner: {
        type: String,
        default:"https://ik.imagekit.io/Avinash/E-commerce/Screenshot%202026-02-14%20at%203.28.35%E2%80%AFPM.png?updatedAt=1776775229438"
    },

    subscriberCount: {
        type: Number,
        default: 0,
        min:0
    }

}, { timestamps: true });

const channelModel = mongoose.model("channel", channelSchema);

export default channelModel