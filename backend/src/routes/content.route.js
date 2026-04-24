import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middlewares/auth.middleware.js";
import {uploadVideo,getChannelVideo,deleteVideo,updateVideo,allVideo,getVideoById,videoLike,videoDislike,videoView, searchVideos} from "../controllers/content.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
const router =Router();

/**
 * upload video
 */
router.post("/upload/video",authenticateUser, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), uploadVideo);


/**
 * get channel video
 */
router.get("/channel/:channelID",getChannelVideo)

/**
 * delete video
 */
router.get("/delete/:videoId",authenticateUser,deleteVideo);

/**
 * update video
 */
router.post("/update/:videoId",authenticateUser, upload.single('thumbnail'), updateVideo)

/**
 * get all video
 */
router.get("/video/all",allVideo);
router.get("/search", searchVideos);


/**
 * get video by id
 */
router.get("/video/:videoId", getVideoById);

/**
 * like
 */
router.get("/like/:videoId/",authenticateUser,videoLike);

/**
 * dislike
 */
router.get("/dislike/:videoId/",authenticateUser,videoDislike);



/**
 * view
 */
router.get("/view/:videoId", optionalAuthenticateUser, videoView);

export default router