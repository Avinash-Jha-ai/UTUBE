import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channel",
        required: true
    }
}, { timestamps: true });

subscribeSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

const subscribeModel = mongoose.model("subscribe", subscribeSchema);

export default subscribeModel;