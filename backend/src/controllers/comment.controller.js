import commentModel from "../models/comment.model.js";

export const addComment = async (req, res) => {
    const { videoId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    try {
        if (!content) {
            return res.status(400).json({ success: false, message: "Comment content is required" });
        }

        const comment = await commentModel.create({
            video: videoId,
            user: userId,
            content,
            parentComment: parentCommentId || null
        });

        const populatedComment = await commentModel.findById(comment._id).populate("user", "name avatar");

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        console.log("Error in addComment:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getVideoComments = async (req, res) => {
    const { videoId } = req.params;

    try {
        const comments = await commentModel.find({ video: videoId, parentComment: null })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        console.log("Error in getVideoComments:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getCommentReplies = async (req, res) => {
    const { commentId } = req.params;
    try {
        const replies = await commentModel.find({ parentComment: commentId })
            .populate("user", "name avatar")
            .sort({ createdAt: 1 });
        return res.status(200).json({ success: true, replies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const likeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    try {
        const comment = await commentModel.findById(commentId);
        if (!comment) return res.status(404).json({ success: false });

        const alreadyLiked = comment.likes.includes(userId);
        if (alreadyLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId);
        } else {
            comment.likes.push(userId);
            comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);
        }
        await comment.save();
        return res.status(200).json({ success: true, likes: comment.likes.length, liked: !alreadyLiked });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const dislikeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    try {
        const comment = await commentModel.findById(commentId);
        if (!comment) return res.status(404).json({ success: false });

        const alreadyDisliked = comment.dislikes.includes(userId);
        if (alreadyDisliked) {
            comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);
        } else {
            comment.dislikes.push(userId);
            comment.likes = comment.likes.filter(id => id.toString() !== userId);
        }
        await comment.save();
        return res.status(200).json({ success: true, dislikes: comment.dislikes.length, disliked: !alreadyDisliked });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};


export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
        }

        await commentModel.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleteComment:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
