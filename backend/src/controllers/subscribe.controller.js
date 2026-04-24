import subscribeModel from "../models/subscribe.model.js";
import channelModel from "../models/channel.model.js";

export const subscribeChannel = async (req, res) => {
    const userId = req.user.id;
    const { channelId } = req.params;

    try {
        // check already subscribed
        const existing = await subscribeModel.findOne({
            subscriber: userId,
            channel: channelId
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Already subscribed"
            });
        }

        // create subscription
        await subscribeModel.create({
            subscriber: userId,
            channel: channelId
        });

        // increment count
        await channelModel.findByIdAndUpdate(channelId, {
            $inc: { subscriberCount: 1 }
        });

        return res.status(200).json({
            success: true,
            message: "Subscribed successfully"
        });

    } catch (error) {
        console.log("error in subscribe:", error);
    }
};

export const unsubscribeChannel = async (req, res) => {
    const userId = req.user.id;
    const { channelId } = req.params;

    try {
        const deleted = await subscribeModel.findOneAndDelete({
            subscriber: userId,
            channel: channelId
        });

        if (!deleted) {
            return res.status(400).json({
                success: false,
                message: "Not subscribed"
            });
        }

        // decrement count but prevent negative
        const channel = await channelModel.findById(channelId);
        if (channel && channel.subscriberCount > 0) {
            await channelModel.findByIdAndUpdate(channelId, {
                $inc: { subscriberCount: -1 }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Unsubscribed successfully"
        });

    } catch (error) {
        console.log("error in unsubscribe:", error);
    }
};

export const getSubscriberCount = async (req, res) => {
    const { channelId } = req.params;

    try {
        const channel = await channelModel.findById(channelId);

        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel not found"
            });
        }

        return res.status(200).json({
            success: true,
            count: channel.subscriberCount
        });

    } catch (error) {
        console.log("error in getSubscriberCount:", error);
    }
};

export const getUserSubscriptions = async (req, res) => {
    const userId = req.user.id;

    try {
        const subscriptions = await subscribeModel
            .find({ subscriber: userId })
            .populate("channel");

        return res.status(200).json({
            success: true,
            data: subscriptions
        });

    } catch (error) {
        console.log("error in getUserSubscriptions:", error);
    }
};

export const isSubscribed = async (req, res) => {
    const userId = req.user.id;
    const { channelId } = req.params;

    try {
        const exists = await subscribeModel.findOne({
            subscriber: userId,
            channel: channelId
        });

        return res.status(200).json({
            success: true,
            subscribed: !!exists
        });

    } catch (error) {
        console.log("error in isSubscribed:", error);
    }
};