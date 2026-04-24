import videoModel from "../models/content.model.js";
import { uploadFile } from "../services/storage.service.js";
import channelModel from "../models/channel.model.js";
import userModel from "../models/user.model.js";

export const uploadVideo = async (req, res) => {
    const { title, description, isPublic } = req.body;

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    const userId = req.user.id;


    try {
        const channel = await channelModel.findOne({ owner: userId });

        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel not found. Create a channel first."
            });
        }
        if (!videoFile) {
            return res.status(400).json({
                success: false,
                message: "Video file is required"
            });
        }

        const uploadedVideo = await uploadFile({
            buffer: videoFile.buffer,
            fileName: videoFile.originalname
        });

        let thumbnailUrl = "";
        if (thumbnailFile) {
            const uploadedThumb = await uploadFile({
                buffer: thumbnailFile.buffer,
                fileName: thumbnailFile.originalname
            });
            thumbnailUrl = uploadedThumb.url;
        }

        const video = await videoModel.create({
            channel: channel._id,
            title,
            description,
            videoUrl: uploadedVideo.url,
            thumbnail: thumbnailUrl,
            isPublic: isPublic === 'true' || isPublic === true
        });

        return res.status(201).json({
            success: true,
            message: "Video uploaded successfully",
            video
        });

    } catch (error) {
        console.log("error in upload video : ", error);
    }
}

export const getChannelVideo = async (req, res) => {
    const { channelID } = req.params;

    try {

        const channel = await channelModel.findById(channelID);

        if (!channel) {
            return res.status(400).json({
                message: "channel not found",
                success: false
            })
        }

        const videos = await videoModel.find({ channel: channelID }).populate("channel");

        return res.status(200).json({
            message: "all video of the channel fetch",
            success: true,
            videos
        })


    } catch (error) {
        console.log("error in get channel video : ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteVideo = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    try {
        const video = await videoModel.findById(videoId);

        if (!video) {
            return res.status(400).json({
                message: "video not found",
                success: false
            })
        }

        const channel = await channelModel.findById(video.channel);

        if (!channel || channel.owner.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to delete this video",
                success: false
            });
        }

        await videoModel.findByIdAndDelete(videoId);

        return res.status(200).json({
            message: "video deleted successfully",
            success: true
        })

    } catch (error) {
        console.log("error in delete video : ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateVideo = async (req, res) => {
    const { title, description, isPublic } = req.body;
    const thumbnailFile = req.file;
    const userId = req.user.id;
    const { videoId } = req.params
    try {
        const video = await videoModel.findById(videoId);

        if (!video) {
            return res.status(404).json({
                message: "video not found",
                success: false
            });
        }

        const channel = await channelModel.findById(video.channel);

        if (!channel || channel.owner.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to update this video",
                success: false
            });
        }
        if (title) video.title = title;
        if (description) video.description = description;
        if (isPublic !== undefined) video.isPublic = isPublic;
        if (thumbnailFile) {
            const uploaded = await uploadFile({
                buffer: thumbnailFile.buffer,
                fileName: thumbnailFile.originalname
            });

            video.thumbnail = uploaded.url;
        }

        await video.save();

        return res.status(200).json({
            message: "video updated successfully",
            success: true,
            video
        });

    } catch (error) {
        console.log("error in update video : ", error);
    }
}

export const getVideoById = async (req, res) => {
    const { videoId } = req.params;

    try {
        const video = await videoModel.findById(videoId).populate("channel");

        if (!video) {
            return res.status(404).json({
                message: "video not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "video fetch successfully",
            success: true,
            video
        });

    } catch (error) {
        console.log("error in get video by id : ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const allVideo = async (req, res) => {
    try {
        const videos = await videoModel
            .find()
            .populate("channel")
            .sort({ createdAt: -1 })
            .limit(20);

        return res.status(200).json({
            message: "all video fetch successfully",
            success: true,
            videos
        });
    } catch (error) {
        console.log("error in all video : ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const videoLike = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    try {
        const video = await videoModel.findById(videoId);

        if (!video) {
            return res.status(404).json({
                message: "video not found",
                success: false
            });
        }

        // ✅ ensure arrays exist
        if (!video.likes) video.likes = [];
        if (!video.dislikes) video.dislikes = [];

        const alreadyLiked = video.likes.some(
            (id) => id.toString() === userId
        );

        if (alreadyLiked) {
            // 🔁 UNLIKE
            video.likes = video.likes.filter(
                (id) => id.toString() !== userId
            );
            await userModel.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } });
        } else {
            // 👍 LIKE
            video.likes.push(userId);
            // Remove from dislikes if it was there
            video.dislikes = video.dislikes.filter(
                (id) => id.toString() !== userId
            );
            await userModel.findByIdAndUpdate(userId, { 
                $addToSet: { likedVideos: videoId }
            });
        }


        await video.save();

        return res.status(200).json({
            success: true,
            likesCount: video.likes.length,
            dislikesCount: video.dislikes.length,
            liked: !alreadyLiked
        });

    } catch (error) {
        console.log("error in like :", error);
    }
};

export const videoDislike = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    try {
        const video = await videoModel.findById(videoId);

        if (!video) {
            return res.status(404).json({
                message: "video not found",
                success: false
            });
        }

        if (!video.likes) video.likes = [];
        if (!video.dislikes) video.dislikes = [];

        const alreadyDisliked = video.dislikes.some(
            (id) => id.toString() === userId
        );

        if (alreadyDisliked) {
            // 🔁 REMOVE DISLIKE
            video.dislikes = video.dislikes.filter(
                (id) => id.toString() !== userId
            );
        } else {
            // 👎 DISLIKE
            video.dislikes.push(userId);

            // ❌ REMOVE FROM LIKE
            video.likes = video.likes.filter(
                (id) => id.toString() !== userId
            );
            await userModel.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } });
        }


        await video.save();

        return res.status(200).json({
            success: true,
            likesCount: video.likes.length,
            dislikesCount: video.dislikes.length,
            disliked: !alreadyDisliked
        });

    } catch (error) {
        console.log("error in dislike :", error);
    }
};

export const videoView = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?.id;

    try {
        const video = await videoModel.findById(videoId);

        if (!video) {
            return res.status(404).json({
                message: "video not found",
                success: false
            });
        }

        if (userId) {
            const alreadyViewed = video.viewers.some(
                (id) => id.toString() === userId
            );

            if (!alreadyViewed) {
                video.viewers.push(userId);
                video.views += 1;
                await video.save();
            }
        } else {
            // For guest users, we could still increment or skip. 
            // The user asked for "one user one view", so I'll just increment for guests for now
            // or we can skip if we only want authenticated unique views.
            video.views += 1;
            await video.save();
        }

        return res.status(200).json({
            success: true,
            views: video.views
        });

    } catch (error) {
        console.log("error in view :", error);
    }
};

export const searchVideos = async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) return res.status(200).json({ success: true, videos: [] });

        const videos = await videoModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } }
            ]
        }).populate("channel", "name avatar");

        return res.status(200).json({ success: true, videos });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};