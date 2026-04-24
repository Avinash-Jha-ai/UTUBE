import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
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
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        default: null
    }
}, { timestamps: true });


const commentModel = mongoose.model("comment", commentSchema);

export default commentModel;
