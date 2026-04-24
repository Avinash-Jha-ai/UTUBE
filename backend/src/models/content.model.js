import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channel",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    videoUrl: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        default: ""
    },

    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user",
        default: []
    },

    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user",
        default: []
    },

    isPublic: {
        type: Boolean,
        default: true
    },

    viewers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user",
        default: []
    },

}, { timestamps: true });


const videoModel= mongoose.model("video", videoSchema);

export default videoModel