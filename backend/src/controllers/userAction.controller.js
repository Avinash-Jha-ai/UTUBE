import userModel from "../models/user.model.js";

export const addToHistory = async (req, res) => {
    const userId = req.user.id;
    const { videoId } = req.params;

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false });

        // Remove if already exists to move it to top
        user.history = user.history.filter(item => item.video.toString() !== videoId);
        user.history.unshift({ video: videoId, watchedAt: new Date() });

        // Keep last 50 videos
        if (user.history.length > 50) user.history.pop();

        await user.save();
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId).populate({
            path: "history.video",
            populate: { path: "channel", select: "name avatar" }
        });
        return res.status(200).json({ success: true, history: user.history });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const clearHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        await userModel.findByIdAndUpdate(userId, { history: [] });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const toggleWatchLater = async (req, res) => {
    const userId = req.user.id;
    const { videoId } = req.params;
    try {
        const user = await userModel.findById(userId);
        const index = user.watchLater.indexOf(videoId);
        let added = false;
        if (index === -1) {
            user.watchLater.push(videoId);
            added = true;
        } else {
            user.watchLater.splice(index, 1);
        }
        await user.save();
        return res.status(200).json({ success: true, added });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const getWatchLater = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId).populate({
            path: "watchLater",
            populate: { path: "channel", select: "name avatar" }
        });
        return res.status(200).json({ success: true, videos: user.watchLater });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const getLikedVideos = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId).populate({
            path: "likedVideos",
            populate: { path: "channel", select: "name avatar" }
        });
        return res.status(200).json({ success: true, videos: user.likedVideos });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const checkWatchLater = async (req, res) => {
    const userId = req.user.id;
    const { videoId } = req.params;
    try {
        const user = await userModel.findById(userId);
        const exists = user.watchLater.includes(videoId);
        return res.status(200).json({ success: true, exists });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};
