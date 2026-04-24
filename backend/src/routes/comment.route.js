import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addComment, getVideoComments, deleteComment, likeComment, dislikeComment, getCommentReplies } from "../controllers/comment.controller.js";

const router = Router();

router.post("/add/:videoId", authenticateUser, addComment);
router.get("/video/:videoId", getVideoComments);
router.get("/replies/:commentId", getCommentReplies);
router.get("/like/:commentId", authenticateUser, likeComment);
router.get("/dislike/:commentId", authenticateUser, dislikeComment);
router.delete("/delete/:commentId", authenticateUser, deleteComment);


export default router;
